/**
A Screen is a UI component that shows a UI.
It represents a sheet of paper containing several items of a questionnaire.
In TheFragebogen only one screen is shown at a time.

@abstract
@class Screen
*/
function Screen() {
    this.readyCallback = null;
    this.preloadedCallback = null;
    this.preloaded = true;
    this.node = null;
}
Screen.prototype.constructor = Screen;
/**
@returns {boolean} true if the UI is created, false if not
*/
Screen.prototype.isUIcreated = function() {
    return this.node !== null;
};
/**
Creates the UI.
@abstract
*/
Screen.prototype.createUI = function() {};
/**
(optional) Inform the screen its UI gets shown.
@abstract
*/
Screen.prototype.start = function() {};
/**
Destroy and release the UI.
@abstract
*/
Screen.prototype.releaseUI = function() {};
/**
Returns the stored data in CSV format.
@abstract
*/
Screen.prototype.getDataCSV = function() {};
/**
Set the callback for ready-state changed.
@param {function} [callback]
*/
Screen.prototype.setOnReadyStateChangedCallback = function(callback) {
    if (!(callback instanceof Function)) {
        TheFragebogen.logger.error(this.constructor.name + ".setOnReadyStateChangedCallback()", "Provided callback ist not a function.");
        return false;
    }

    TheFragebogen.logger.debug(this.constructor.name + ".setOnReadyStateChangedCallback()", "called.");
    this.readyCallback = callback;
    return true;
};
/**
Call onReadyStateChanged-callback
*/
Screen.prototype._sendReadyStateChangedCallback = function() {
    if (!(this.readyCallback instanceof Function)) {
        TheFragebogen.logger.error(this.constructor.name + "._sendReadyStateChangedCallback()", "called, but no readyCallback set.");
        return;
    }
    TheFragebogen.logger.debug(this.constructor.name + "._sendReadyStateChangedCallback()", "called");
    this.readyCallback();
};
/**
Is the screen ready and TheFragebogen can continue to the next one?
@abstract
@returns {boolean} true Is the screen ready?
*/
Screen.prototype.isReady = function() {
    return true;
};
/**
Starts preloading external media.
Default implementation immediately sends callback `Screen._sendOnPreloadedCallback()`.
@abstract
*/
Screen.prototype.preload = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".preload()", "Must be overridden for preloading.");
    this._sendOnPreloadedCallback();
};
/**
All external resources loaded?
@abstract
@returns {boolean}
*/
Screen.prototype.isPreloaded = function() {
    return this.preloaded;
};
/**
 Calls the function defined by setOnPreloadedCallback()
 */
Screen.prototype._sendOnPreloadedCallback = function() {
    if (!(this.preloadedCallback instanceof Function)) {
        TheFragebogen.logger.error(this.constructor.name + "._sendOnPreloadedCallback()", "called, but no preloadedCallback set.");
        return;
    }
    this.preloadedCallback();
};

/**
 Sets a preloadedCallback function to be called when screen preloading
 is finished.
 */
Screen.prototype.setOnPreloadedCallback = function(preloadedCallback) {
    if (!(preloadedCallback instanceof Function)) {
        TheFragebogen.logger.error(this.constructor.name + ".setOnPreloadedCallback()", "No callback handle given.");
        return false;
    }

    TheFragebogen.logger.debug(this.constructor.name + ".setOnPreloadedCallback()", "called");
    this.preloadedCallback = preloadedCallback;
    return true;
};
