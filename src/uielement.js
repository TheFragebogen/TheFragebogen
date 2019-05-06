/**
Abstract controller class for generic UI elements.
Only provides a set of API that must be implemented by childs.

@abstract
@class UIElement
*/
class UIElement {

    constructor() {
    this.uiCreated = false;
    this.enabled = false;
    this.visible = true;
    this.preloaded = true;

    this.preloadedCallback = null;
}

/**
@returns {boolean} true if the UI is created, false if not
*/
isUIcreated() {
    return this.uiCreated;
}

/**
Creates the UI of the element.
@abstract
@return {object}
*/
createUI() {
    TheFragebogen.logger.debug(this.constructor.name + ".createUI()", "This method must be overridden.");
}

/**
Destroys the UI.
*/
releaseUI() {
    this.uiCreated = false;
    this.enabled = false;
}

/**
Returns data stored by the object.
@abstract
@return {object}
*/
getData() {
    TheFragebogen.logger.debug(this.constructor.name + ".getData()", "This method might need to be overridden.");
}

/**
Evaluates if the newData is valid for this object.
@abstract
@param {} [newData]
*/
_checkData(newData) {
    TheFragebogen.logger.debug(this.constructor.name + "._checkData()", "This method might need to be overridden.");
}

/**
Sets the provided data.
A check using `_checkData(newData)` must be conducted.
@abstract
@param {} [newData]
*/
setData() {
    TheFragebogen.logger.debug(this.constructor.name + ".setData()", "This method might need to be overridden.");
}

/**
@abstract
@return {boolean} Is the UI of this element enabled?
*/
isEnabled() {
    return this.enabled;
}

/**
Set UI enabled state.
@abstract
@param {boolean} enabled
*/
setEnabled(enabled) {
    TheFragebogen.logger.warn(this.constructor.name + ".setEnabled()", "This method must be overridden.");
}

/**
@abstract
@return {boolean} Is the UI of this element visible?
*/
isVisible() {
    return this.visible;
}

/**
Set UI visible state.
@abstract
*/
setVisible() {
    TheFragebogen.logger.warn(this.constructor.name + ".setVisible()", "This method must be overridden.");
}

/**
@returns {string} The type of this class usually the name of the class.
*/
getType() {
    return this.constructor.name;
}

/**
@abstract
@return {boolean} Is the element ready?
*/
isReady() {
    TheFragebogen.logger.debug(this.constructor.name + ".isReady()", "This method might need to be overridden.");
    return true;
}

/**
Starts preloading external media.
Default implementation immedately sends callback `Screen._sendOnScreenPreloadedCallback()`.
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
Set callback to get informed when loading of all required external data is finished.
@param {Function}
@return {boolean}
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

/**
Sends this.onPreloadCallback() to signalize that all required data could be loaded.
@return {boolean}
*/
_sendOnPreloadedCallback() {
    if (!(this.preloadedCallback instanceof Function)) {
        TheFragebogen.logger.warn(this.constructor.name + "._sendOnPreloadedCallback()", "called, but no onScreenPreloadedCallback set.");
        return false;
    }
    this.preloaded = true;
    this.preloadedCallback();
}

/**
@abstract
@return {string} Returns a string representation of this object.
*/
toString() {
    TheFragebogen.logger.debug(this.constructor.name + ".toString()", "This method might need to be overridden.");
}
}
