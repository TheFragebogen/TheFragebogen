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

        this.button = null;

        TheFragebogen.logger.debug(this.constructor.name + "()", "className as " + this.className + " and caption as " + this.caption);
    }

    createUI() {
        this.node = document.createElement("div");
        this.applyCSS();

        this.button = document.createElement("button");
        this.button.innerHTML = this.caption;
        this.button.addEventListener("click", () => this._onClick());

        this.node.appendChild(this.button);
        return this.node;
    }

    releaseUI() {
        super.releaseUI();
        this.button = null;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        this.button.disabled = !this.enabled;
    }

    _onClick() {
        if (this.actionCallback) {
            this.actionCallback();
        }
    }

    setVisible(visible) {
        this.visible = visible;
        this.node.hidden = this.visible ? "" : "hidden";
    }
}
