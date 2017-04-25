/**
Abstract controller class for generic UI elements.
Only provides a set of API that must be implemented by childs.

@abstract
@class UIElement
*/
function UIElement() {
    this.uiCreated = false;
    this.enabled = false;
    this.visible = true;
    this.preloaded = true;

    this.preloadedCallback = null;
}
UIElement.prototype.constructor = UIElement;
/**
@returns {boolean} true if the UI is created, false if not
*/
UIElement.prototype.isUIcreated = function() {
    return this.uiCreated;
};
/**
Creates the UI of the element.
@return {object}
@abstract
*/
UIElement.prototype.createUI = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".createUI()", "This method must be overridden.");
};
/**
Destroys the UI.
@abstract
*/
UIElement.prototype.releaseUI = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".releaseUI()", "This method might need to be overridden.");
};
/**
Returns data stored by the object.
@return {object}
@abstract
*/
UIElement.prototype.getData = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".getData()", "This method might need to be overridden.");
};
/**
Evaluates if the newData is valid for this object.
@param {} [newData]
@abstract
*/
UIElement.prototype._checkData = function(newData) {
    TheFragebogen.logger.debug(this.constructor.name + "._checkData()", "This method might need to be overridden.");
};
/**
Sets the provided data.
A check using `_checkData(newData)` must be conducted.
@param {} [newData]
@abstract
*/
UIElement.prototype.setData = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".setData()", "This method might need to be overridden.");
};
/**
@return {boolean} Is the UI of this element enabled?
@abstract
*/
UIElement.prototype.isEnabled = function() {
    return this.enabled;
};
/**
Set UI enabled state.
@abstract
@param {boolean} enabled
*/
UIElement.prototype.setEnabled = function(enabled) {
    TheFragebogen.logger.warn(this.constructor.name + ".setEnabled()", "This method must be overridden.");
};
/**
@return {boolean} Is the UI of this element visible?
@abstract
*/
UIElement.prototype.isVisible = function() {
    return this.visible;
};
/**
Set UI visible state.
@abstract
*/
UIElement.prototype.setVisible = function() {
    TheFragebogen.logger.warn(this.constructor.name + ".setVisible()", "This method must be overridden.");
};
/**
@returns {string} The type of this class usually the name of the class.
*/
UIElement.prototype.getType = function() {
    return this.constructor.name;
};
/**
@abstract
@return {boolean} Is the element ready?
*/
UIElement.prototype.isReady = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".isReady()", "This method might need to be overridden.");
    return true;
};
/**
Starts preloading external media.
Default implementation immedately sends callback `Screen._sendOnScreenPreloadedCallback()`.
@abstract
*/
UIElement.prototype.preload = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".preload()", "Must be overridden for preloading.");
    this._sendOnPreloadedCallback();
};
/**
All external resources loaded?
@abstract
@returns {boolean}
*/
UIElement.prototype.isPreloaded = function() {
    return this.preloaded;
};
/**
Set callback to get informed when loading of all required external data is finished.
@param {Function}
@return {boolean}
*/
UIElement.prototype.setOnPreloadedCallback = function(preloadedCallback) {
    if (!(preloadedCallback instanceof Function)) {
        TheFragebogen.logger.error(this.constructor.name + ".setOnPreloadedCallback()", "No callback handle given.");
        return false;
    }

    TheFragebogen.logger.debug(this.constructor.name + ".setOnPreloadedCallback()", "called");
    this.preloadedCallback = preloadedCallback;
    return true;
};
/**
Sends this.onPreloadCallback() to signalize that all required data could be loaded.
@return {boolean}
*/
UIElement.prototype._sendOnPreloadedCallback = function() {
    if (!(this.preloadedCallback instanceof Function)) {
        TheFragebogen.logger.warn(this.constructor.name + "._sendOnPreloadedCallback()", "called, but no onScreenPreloadedCallback set.");
        return false;
    }
    this.preloaded = true;
    this.preloadedCallback();
};
/**
@return {string} Returns a string representation of this object.
@abstract
*/
UIElement.prototype.toString = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".toString()", "This method might need to be overridden.");
};
