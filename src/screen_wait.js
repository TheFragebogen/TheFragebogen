/**
A screen that waits for the defined duration while presenting a message.
Fancy animation(s) can be shown using CSS.

@class ScreenWait
@augments Screen
*/
class ScreenWait extends Screen {

    /**
    @param {string} [className] CSS class
    @param {number} [time=2] The time to wait in seconds
    @param {string} [html="Please wait..."] The HTML content to be presented.
    */
    constructor(className, time, html) {
        super(className);

        this.time = !isNaN(time) ? Math.abs(time) * 1000 : 2;
        this.html = typeof(html) === "string" ? html : "Please wait...";

        this.timeoutHandle = null;
        this.readyCallback = null;

        TheFragebogen.logger.debug(this.constructor.name, "Set: time as " + this.time + " and html as " + this.html);
    }

    createUI() {
        this.node = document.createElement("div");
        this.node.innerHTML = this.html;
        this.applyCSS();

        return this.node;
    }

    _startTimer() {
        TheFragebogen.logger.info(this.constructor.name + "._startTimer()", "New screen will be displayed in " + this.time + "ms.");
        this.timeoutHandle = setTimeout(() => this._onWaitTimeReached(), this.time);
    }

    /**
    Starts the timer.
    */
    start() {
        this._startTimer();
    }

    _onWaitTimeReached() {
        this._sendPaginateCallback();

    }
    releaseUI() {
        super.releaseUI();
        clearTimeout(this.timeoutHandle);
        this.timeoutHandle = null;
    }
}
