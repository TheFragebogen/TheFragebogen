/**
A Screen is a UI component that shows a UI.
It represents a sheet of paper containing several items of a questionnaire.
In TheFragebogen only one screen is shown at a time.

@abstract
@class Screen
*/
class Screen {

    /**
    @param {string} [className] CSS class
    */
    constructor(className) {
        this.className = className;

        this.paginateCallback = null;
        this.preloadedCallback = null;
        this.preloaded = true;

        this.node = null;
    }

    /**
    @returns {boolean} true if the UI is created, false if not
    */
    isUIcreated() {
        return this.node !== null;
    }

    /**
    Creates the UI.
    @abstract
    */
    createUI() {}

    /**
    Applies the set className.
    Usually called during createUI().
    */
    applyCSS() {
        if (this.isUIcreated() && this.className !== undefined) {
            this.node.className = this.className;
        }
    }

    /**
    (optional) Inform the screen its UI gets shown.
    @abstract
    */
    start() {}

    /**
    Destroy and release the UI.
    */
    releaseUI() {
        TheFragebogen.logger.info(this.constructor.name + ".releaseUI()", "");
        this.node = null;
    }

    /**
    Returns the stored data.
    @abstract
    @returns {array<array>}
    */
    getData() {}

    /**
    Set the callback for ready-state changed.
    @param {function} [callback]
    */
    setPaginateCallback(callback) {
        if (!(callback instanceof Function)) {
            TheFragebogen.logger.error(this.constructor.name + ".setPaginateCallback()", "Provided callback ist not a function.");
            return false;
        }

        TheFragebogen.logger.debug(this.constructor.name + ".setPaginateCallback()", "called.");
        this.paginateCallback = callback;
        return true;
    }

    /**
    Call this.paginateCallback().
    @param {number} [relativeScreenId=1] The relative id of the next screen.
    @param {boolean} [isReadyRequired=true] Only send the event if `this.isReady() === true`.
    */
    _sendPaginateCallback(relativeScreenId, isReadyRequired) {
        relativeScreenId = relativeScreenId === undefined ? 1 : relativeScreenId;
        isReadyRequired = isReadyRequired === undefined ? true : isReadyRequired;

        if (!(this.paginateCallback instanceof Function)) {
            TheFragebogen.logger.error(this.constructor.name + "._sendPaginateCallback()", "called, but no paginateCallback set.");
            return;
        }

        if (isReadyRequired && !this.isReady()) {
            TheFragebogen.logger.info(this.constructor.name + "._sendPaginateCallback()", "called while screen is not ready but isReadyRequired is set.");
            return;
        }

        TheFragebogen.logger.debug(this.constructor.name + "._sendPaginateCallback()", "called");
        this.paginateCallback(this, relativeScreenId);
    }

    /**
    Is the screen ready and TheFragebogen can continue to the next one?
    @abstract
    @returns {boolean} true Is the screen ready?
    */
    isReady() {
        return true;
    }

    /**
    Sets the `PaginateUI` for the screen.
    NOTE: Can only be called successfully if `screen.createUI()` is `false`.
    NOTE: This function is _only_ implemented by screens that provide _manual_ pagination.
    @abstract
    @param {function} [paginateUI] Set the `PaginateUI` to be used. Set `null` for no `paginateUI`.
    @returns {boolean} Setting the PaginateUI was successful?
    */
    setPaginateUI(paginateUI) {
        TheFragebogen.logger.warn(this.constructor.name + ".setPaginateUI()", "This method might need to be overridden.");
        return false;
    }

    /**
    Starts preloading external media.
    Default implementation immediately sends callback `Screen._sendOnPreloadedCallback()`.
    @abstract
    */
    preload() {
        TheFragebogen.logger.debug(this.constructor.name + ".preload()", "Must be overridden for preloading.");
        this._sendOnPreloadedCallback();
    }

    /**
    All external resources loaded?
    @abstract
    @returns {boolean}
    */
    isPreloaded() {
        return this.preloaded;
    }

    /**
     Calls the function defined by setOnPreloadedCallback()
     */
    _sendOnPreloadedCallback() {
        if (!(this.preloadedCallback instanceof Function)) {
            TheFragebogen.logger.error(this.constructor.name + "._sendOnPreloadedCallback()", "called, but no preloadedCallback set.");
            return;
        }
        this.preloadedCallback();
    }

    /**
     Sets a preloadedCallback function to be called when screen preloading
     is finished.
     */
    setOnPreloadedCallback(preloadedCallback) {
        if (!(preloadedCallback instanceof Function)) {
            TheFragebogen.logger.error(this.constructor.name + ".setOnPreloadedCallback()", "No callback handle given.");
            return false;
        }

        TheFragebogen.logger.debug(this.constructor.name + ".setOnPreloadedCallback()", "called");
        this.preloadedCallback = preloadedCallback;
        return true;
    }
}
