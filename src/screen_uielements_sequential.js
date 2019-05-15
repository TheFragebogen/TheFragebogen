/**
A screen that presents one or more UIElements.
All UIElements are visible by default.
UIElements are enabled one after another, i.e., if its predecessing UIElement reported to be ready the next one is enabled.

@class ScreenUIElementsSequential
@augments Screen
@augments ScreenUIElements
*/
class ScreenUIElementsSequential extends ScreenUIElements {

    /**
    @param {string} [className=] CSS class
    @param {...UIElement} arguments an array containing the UIElements of the screen
    */
    constructor(...args) {
        super(...args);
        this.currentElementIndex = null;
    }

    start() {
        for (let i = 0; i < this.uiElements.length; i++) {
            if (this.uiElements[i] instanceof UIElementInteractive) {
                this.uiElements[i].setOnReadyStateChangedCallback(null);
            }
            this.uiElements[i].setEnabled(false);
            if (this.uiElements[i] instanceof UIElementInteractive) {
                this.uiElements[i].setOnReadyStateChangedCallback(() => this._onUIElementReady());
            }
        }

        for (let i = 0; i < this.uiElements.length; i++) {
            if (this.uiElements[i] instanceof UIElementInteractive) {
                this.currentElementIndex = i;
                this.uiElements[this.currentElementIndex].setEnabled(true);
                break;
            }
        }
        if (this.currentElementIndex == undefined) {
            TheFragebogen.logger.error(this.constructor.name + "", "One UIElementInteractive is at least required.");
        }
    }

    /**
    Callback to enable the following UIElementInteractive.
     */
    _onUIElementReady() {
        TheFragebogen.logger.info(this.constructor.name + "._onUIElementReady()", "called");

        let nextElementIndex = -1;
        for (let i = this.currentElementIndex + 1; i < this.uiElements.length; i++) {
            if (this.uiElements[i] instanceof UIElementInteractive) {
                nextElementIndex = i;
                break;
            }
            this.uiElements[i].setEnabled(true);
        }

        if (nextElementIndex === -1) {
            TheFragebogen.logger.warn(this.constructor.name + "._onUIElementReady()", "There is no next UIElement to enable left.");
            return;
        }

        this.uiElements[this.currentElementIndex].setEnabled(false);
        this.currentElementIndex = nextElementIndex;
        this.uiElements[this.currentElementIndex].setEnabled(true);
    }
}
