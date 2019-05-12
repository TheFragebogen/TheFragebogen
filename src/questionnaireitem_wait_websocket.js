/**
This QuestionnaireItem connects to a Websocket server and may
a) send a message (ignore incoming messages),
b) wait until a certain message is received, or
c) a) and b).

Notes:
* This QuestionnaireItem is _always_ required.
* Starts connecting on setting `QuestionnaireItemWaitWebsocket.setEnabled(true)`.
* Automatically tries to reconnect on connection failure: message resend on every reconnect.
  IMPORTANT: Please note that this approach is brute force and at the moment ignores _permanent failures_ (HTTP: 404) are not handled.
* After reaching timeout, this element sets itself to ready=true.


Uses CSS classes:
* this.className (Initial before enabling)
* this.className + "Connecting"
* this.className + "Connected"
* this.className + "Reconnecting"
* this.className + "Ready" (required message received)
* NOT this.className + "Required" via `Questionnaire.markRequired()`

@class QuestionnaireItemWaitWebsocket
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemWaitWebsocket extends QuestionnaireItem {

    /**
    @param {string} [className] CSS class

    @param {string} url The websocket URL, eg., ws://localhost:8080/someLocation.
    @param {string} [messageReceive=undefined]
    @param {string} [messageSend=undefined]
    @param {number} [reconnectAttempts=-1] Number of attempts to reconnect; negative number: forever.
    @param {number} [timeout=0] Timeout in seconds.
    */
    constructor(className, url, messageSend, messageReceive, reconnectAttempts, timeout) {
        super(className, "", true);

        this.url = url;
        this.messageSend = messageSend;
        this.messageReceive = messageReceive;

        if (this.messageSend === undefined && this.messageReceive === undefined) {
            TheFragebogen.logger.error("QuestionnaireItemWaitWebsocket()", "messageSend and messageReceive are undefined; this component will not do anything.");
        }

        this.reconnectAttempts = !isNaN(reconnectAttempts) ? reconnectAttempts : -1;
        this.timeout = !isNaN(timeout) ? Math.abs(timeout) * 1000 : 0;

        this.node = null;
        this.websocketConnection = null;
        this.connectionFailures = 0;

        TheFragebogen.logger.warn("QuestionnaireItemWaitWebsocket()", "Set: url as " + this.url + ", messageSend as" + this.messageSend + ", messageReceive as " + this.messageReceive + "and timeout as " + this.timeout);
    }

    createUI() {
        this.node = document.createElement("div");
        this.node.className = this.className;
        return this.node;
    }

    setEnabled(enabled) {
        this.enabled = enabled;

        if (this.enabled) { //Let's connect (and start timer)!
            this._handleConnect();

            if (this.timeout !== 0) {
                this.timeoutHandle = setTimeout(() => this._onTimeout(), this.timeout);
            }
        }
    }

    _handleConnect() {
        if (this.websocketConnection === null) {
            this.websocketConnection = new WebSocket(this.url);

            this.node.className = this.className + "Connecting";

            this.websocketConnection.onopen = () => this._onConnected();
            this.websocketConnection.onmessage = (event) => this._onMessage(event);
            this.websocketConnection.onerror = (event) => this._onWebsocketError(event);
            this.websocketConnection.onclose = (event) => this._onWebsocketClose(event);
        }
    }

    _onConnected() {
        this.node.className = this.className + "Connected";

        if (this.messageSend === undefined) {
            TheFragebogen.logger.info(this.constructor.name + ".connection.onopen()", "Connection opened.");
        }

        this.websocketConnection.send(this.messageSend);
        TheFragebogen.logger.info(this.constructor.name + ".connection.onopen()", "Connection opened and message <<" + this.messageSend + ">> delivered.");
    }

    _onMessage(event) {
        if (event.data && event.data !== this.messageReceive) {
            TheFragebogen.logger.warn(this.constructor.name + ".connection.onmessage()", "Received unknown message: <<" + event.data + ">>; waiting for <<" + this.messageReceive + ">>");
            return;
        }

        TheFragebogen.logger.info(this.constructor.name + ".connection.onmessage()", "Received correct message.");
        this.answer = new Date().toString();
        this.node.className = this.className + "Ready";

        this._sendReadyStateChanged();
    }

    _onWebsocketError(error) {
        this.node.className = this.className + "Reconnecting";
        TheFragebogen.logger.warn(this.constructor.name + ".connection.onerror()", error);
        //Reconnect handled by onclose
    }

    _onWebsocketClose() {
        TheFragebogen.logger.warn(this.constructor.name + ".connection.onclose()", "Connection closed.");

        if (this.isReady()) {
            return;
        }

        //Retry?
        if (this.reconnectAttempts === -1 || this.connectionFailures < this.reconnectAttempts) {
            TheFragebogen.logger.warn(this.constructor.name + ".connection.onclose.setTimeout._anonymousFunction()", "Trying to reconnect...");

            this.websocketConnection = null;
            this._handleConnect();

            return;
        }

        //Failed permanently: That's bad...
        TheFragebogen.logger.error(this.constructor.name + ".connection.onclose()", "Maximal number of attempts reached. QuestionnaireItemWaitWebsocket will not try to reconnect again!");
        this.ready = true;
        this._sendReadyStateChanged();
    }

    _onTimeout() {
        this._sendReadyStateChanged();

        TheFragebogen.logger.warn(this.constructor.name + "._handleTimeout()", "Waiting got timeout after " + (!this.connectionFailures ? (this.timeout + "ms.") : (this.connectionFailures + " attempt(s).")));
    }

    markRequired() {
        //This elements shows its status and is always required.
    }

    releaseUI() {
        super.releaseUI();

        clearTimeout(this.timeoutHandle);
        this.timeoutHandle = null;

        if (this.websocketConnection !== null && (this.websocketConnection.readyState == WebSocket.CONNECTING || this.websocketConnection.readyState == WebSocket.OPEN)) {
            this.websocketConnection.onclose = () => TheFragebogen.logger.info(this.constructor.name + ".connection.onclose()", "Connection closed.");
            this.websocketConnection.close();
        }
        this.websocketConnection = null;
    }
}
