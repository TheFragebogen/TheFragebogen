/**
A UIElement that has an interactive UI and thus might not be ready in the beginning but requiring user interaction before its goal is fulfilled.

@abstract
@class UIElementInteractive
@augments UIElement
*/
function UIElementInteractive() {
    UIElement.call(this);
    this.enabled = false;
    this.onReadyStateChanged = null;
}
UIElementInteractive.prototype = Object.create(UIElement.prototype);
UIElementInteractive.prototype.constructor = UIElementInteractive;

UIElementInteractive.prototype.isEnabled = function() {
    return this.enabled;
};

UIElementInteractive.prototype.setEnabled = function(enabled) {
    this.enabled = enabled;
    TheFragebogen.logger.debug(this.constructor.name + ".setEnabled()", "This method might need to be overridden.");
};

UIElementInteractive.prototype.setOnReadyStateChangedCallback = function(onReadyStateChanged) {
    if (onReadyStateChanged instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + ".setOnReadyStateChangedCallback()", "called");
        this.onReadyStateChanged = onReadyStateChanged;
    }
};

UIElementInteractive.prototype._sendReadyStateChanged = function() {
    if (this.onReadyStateChanged instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + "._sendReadyStateChanged()", "called");
        this.onReadyStateChanged(this);
    }
};

/**
Updates the UI to inform to reflect that this element is _yet_ not ready.
@abstract
*/
UIElementInteractive.prototype.markRequired = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".markRequired()", "This method should be overridden.");
};
