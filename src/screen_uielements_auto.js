/**
A screen that presents one or more UIElements and reports ready _automatically_ when all UIElements are ready.
All UIElements are visible and enabled by default.

NOTE: UIElementsInteractive should be marked as REQUIRED.

@class ScreenUIElementsAuto
@augments Screen
@augments ScreenUIElements

@param {string} [className] CSS class
@param {array} arguments an array containing the UIElements of the screen
*/
function ScreenUIElementsAuto() {
    ScreenUIElements.apply(this, arguments);
}
ScreenUIElementsAuto.prototype = Object.create(ScreenUIElements.prototype);
ScreenUIElementsAuto.prototype.constructor = ScreenUIElementsAuto;

ScreenUIElementsAuto.prototype.createUI = function() {
    this.node = document.createElement("div");
    this.node.className = this.className;

    for (var index in this.uiElements) {
        if (!this.uiElements[index] instanceof UIElement) {
            TheFragebogen.logger.warn(this.constructor.name + ".createUI():", "Element[" + index + "] has no 'createUI' method");
            continue;
        }
        var node = this.uiElements[index].createUI();
        if (node !== undefined && node !== null) {
            this.node.appendChild(node);
        }
        if (this.uiElements[index].setOnReadyStateChangedCallback instanceof Function) {
            this.uiElements[index].setOnReadyStateChangedCallback(this._onUIElementReady.bind(this));
        }
    }

    return this.node;
};
Screen.prototype._onUIElementReady = function() {
    if (this.isReady()) {
        this._sendPaginateCallback();
    }
};
Screen.prototype.setPaginateUI = function(paginateUI) {
    TheFragebogen.logger.warn(this.constructor.name + ".setPaginateUI()", "Does not support pagination.");
    return false;
};
