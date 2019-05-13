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
        this.applyCSS();

        for (let i = 0; i < this.uiElements.length; i++) {
            if (!(this.uiElements[i] instanceof UIElement)) {
                TheFragebogen.logger.warn(this.constructor.name + ".createUI()", "Element[" + i + "] has no 'createUI' method");
                continue;
            }

            const uiElementNode = this.uiElements[i].createUI();
            if (uiElementNode instanceof HTMLElement) {
                this.node.appendChild(uiElementNode);
            } else {
                TheFragebogen.logger.warn(this.constructor.name + ".createUI()", "Element[" + i + "].createUI() did not a HTMLElement.");
            }

            if (this.uiElements[i].setOnReadyStateChangedCallback instanceof Function) {
                this.uiElements[i].setOnReadyStateChangedCallback(() => this._onUIElementReady());
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
