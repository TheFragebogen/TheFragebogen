/**
Base class of Screens that handle data export.

Displays a HTML message.

@abstract
@class ScreenWaitData
@augments Screen
@augments ScreenWait

@param {string} [className=""] CSS class
@param {number} time Time to wait in seconds
@param {string} message The message to display (HTML)
 */
function ScreenWaitData(className, time, message) {
    ScreenWait.call(this, className, time, message);

    this.data = null;

    this.getDataCallback = null;
}
ScreenWaitData.prototype = Object.create(Screen.prototype);
ScreenWaitData.prototype.constructor = ScreenWaitData;

ScreenWaitData.prototype.setGetDataCallback = function(getDataCallback) {
    if (getDataCallback instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + ".setGetDataCallback()", "called");
        this.getDataCallback = getDataCallback;
        return true;
    }
    return false;
};

ScreenWaitData.prototype._sendGetDataCallback = function() {
    if (this.getDataCallback instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + "._sendGetDataCallback()", "called");
        this.data = this.getDataCallback();
    }
};
