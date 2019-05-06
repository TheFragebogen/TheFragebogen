/**
A screen that presents one or more UIElements and reports ready _automatically_ when all UIElements are ready.
All UIElements are visible and enabled by default.

NOTE: UIElementsInteractive should be marked as REQUIRED.

@class ScreenUIElementsAuto
@augments Screen
@augments ScreenUIElements
*/
class ScreenUIElementsAuto extends ScreenUIElements {
    /**
    @param {string} [className=] CSS class
    @param {...UIElement} arguments an array containing the UIElements of the screen
    */
    constructor(...args) {
    super(...args);
}

createUI() {
    this.node = document.createElement("div");
    this.node.className = this.className;

    for (var index in this.uiElements) {
        if (!(this.uiElements[index] instanceof UIElement)) {
            TheFragebogen.logger.warn(this.constructor.name + ".createUI()", "Element[" + index + "] has no 'createUI' method");
            continue;
        }

        var uiElementNode = this.uiElements[index].createUI();
        if (uiElementNode instanceof HTMLElement) {
            this.node.appendChild(uiElementNode);
        } else {
            TheFragebogen.logger.warn(this.constructor.name + ".createUI()", "Element[" + index + "].createUI() did not a HTMLElement.");
        }

        if (this.uiElements[index].setOnReadyStateChangedCallback instanceof Function) {
            this.uiElements[index].setOnReadyStateChangedCallback(this._onUIElementReady.bind(this));
        }
    }

    return this.node;
}

_onUIElementReady() {
    if (this.isReady()) {
        this._sendPaginateCallback();
    }
}

setPaginateUI(paginateUI) {
    TheFragebogen.logger.warn(this.constructor.name + ".setPaginateUI()", "Does not support pagination.");
    return false;
}
}
