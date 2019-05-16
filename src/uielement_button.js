/**
A UIElement that shows a button.
The provided callback function gets called if a onclick event occurs on this button.

@class UIElementButton
@augments UIElement
*/
class UIElementButton extends UIElement {

    /**
    @param {string} [className] CSS class
    @param {string} caption Caption of the button
    @param {method} actionCallback Callback function for onclick event
    */
    constructor(className, caption, actionCallback) {
        super(className);

        this.caption = caption;
        this.actionCallback = actionCallback;
    }

    createUI() {
        this.node = document.createElement("div");
        this.uiCreated = true;
        this.applyCSS();

        const button = document.createElement("button");
        button.innerHTML = this.caption;
        button.addEventListener("click", () => this._onClick());

        this.node.appendChild(button);

        return this.node;
    }

    _onClick() {
        if (this.actionCallback) {
            this.actionCallback();
        }
    }
}
