/**
Base class of Screens that handle data export.
Displays a HTML message.

@abstract
@class ScreenWaitData
@augments Screen
@augments ScreenWait
*/
class ScreenWaitData extends ScreenWait {

    /**
    @param {string} [className=""] CSS class
    @param {number} time Time to wait in seconds
    @param {string} message The message to display (HTML)
    */
    constructor(className, time, message) {
    super(className, time, message);

    this.data = null;

    this.getDataCallback = null;
}

setGetDataCallback(getDataCallback) {
    if (getDataCallback instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + ".setGetDataCallback()", "called");
        this.getDataCallback = getDataCallback;
        return true;
    }
    return false;
}

_sendGetDataCallback() {
    if (this.getDataCallback instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + "._sendGetDataCallback()", "called");
        this.data = this.getDataCallback();
    }
}
}
