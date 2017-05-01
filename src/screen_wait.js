/**
A screen that waits for the defined duration while presenting a message.
Fancy animation(s) can be shown using CSS.

@class ScreenWait
@augments Screen

@param {string} [className] CSS class
@param {number} [time=2] The time to wait in seconds
@param {string} [html="Please wait..."] The HTML content to be presented.
*/
function ScreenWait(className, time, html) {
    Screen.call(this);

    this.className = className;
    this.time = !isNaN(time) ? Math.abs(time) * 1000 : 2;
    this.html = typeof(html) === "string" ? html : "Please wait...";

    this.timeoutHandle = null;
    this.readyCallback = null;

    TheFragebogen.logger.debug(this.constructor.name, "Set: time as " + this.time + " and html as " + this.html);
}
ScreenWait.prototype = Object.create(Screen.prototype);
ScreenWait.prototype.constructor = ScreenWait;

ScreenWait.prototype.createUI = function() {
    this.node = document.createElement("div");
    this.node.className = this.className;
    this.node.innerHTML = this.html;

    return this.node;
};

ScreenWait.prototype._startTimer = function() {
    TheFragebogen.logger.info(this.constructor.name + "._startTimer()", "New screen will be displayed in " + this.time + "ms.");
    this.timeoutHandle = setTimeout((this._onWaitTimeReached).bind(this), this.time);
};
/**
Starts the timer.
*/
ScreenWait.prototype.start = function() {
    this._startTimer();
};
ScreenWait.prototype._onWaitTimeReached = function() {
    this._sendReadyStateChangedCallback();
};
ScreenWait.prototype.releaseUI = function() {
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = null;
    this.node = null;
};
