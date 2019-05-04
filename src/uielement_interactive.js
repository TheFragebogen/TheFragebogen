/**
A UIElement that has an interactive UI and thus might not be ready in the beginning but requiring user interaction before its goal is fulfilled.

@abstract
@class UIElementInteractive
@augments UIElement
*/
class UIElementInteractive extends UIElement {
    constructor() {
    super();
    this.enabled = false;
    this.onReadyStateChanged = null;
}

isEnabled() {
    return this.enabled;
}

setEnabled(enabled) {
    this.enabled = enabled;
    TheFragebogen.logger.debug(this.constructor.name + ".setEnabled()", "This method might need to be overridden.");
}

setOnReadyStateChangedCallback(onReadyStateChanged) {
    if (onReadyStateChanged instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + ".setOnReadyStateChangedCallback()", "called");
        this.onReadyStateChanged = onReadyStateChanged;
    }
}

_sendReadyStateChanged() {
    if (this.onReadyStateChanged instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + "._sendReadyStateChanged()", "called");
        this.onReadyStateChanged(this);
    }
}

/**
Updates the UI to inform to reflect that this element is _yet_ not ready.
@abstract
*/
markRequired() {
    TheFragebogen.logger.debug(this.constructor.name + ".markRequired()", "This method should be overridden.");
}
}
