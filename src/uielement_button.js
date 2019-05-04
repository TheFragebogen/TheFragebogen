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
    super();

    this.className = className;
    this.caption = caption;
    this.actionCallback = actionCallback;

    this.node = null;
    this.button = null;

    TheFragebogen.logger.debug(this.constructor.name + "()", "className as " + this.className + " and caption as " + this.caption);
}

createUI() {
    this.node = document.createElement("div");
    this.node.className = this.className;

    this.button = document.createElement("button");
    this.button.innerHTML = this.caption;
    this.button.onclick = this._onclick.bind(this);

    this.node.appendChild(this.button);
    return this.node;
}

releaseUI() {
    this.node = null;
    this.button = null;
}

setEnabled(enabled) {
    this.enabled = enabled;
    this.button.disabled = !this.enabled;
}

_onclick() {
    if (this.actionCallback) {
        this.actionCallback();
    }
}

/**
Returns the caption
@returns {array} caption data stored in the index 0 of the array
*/
getData() {
    return [this.caption];
}

_checkData(data) {
    return data[0] === this.caption;
}

setData(data) {
    return this._checkData(data);
}

setVisible(visible) {
    this.visible = visible;
    this.node.hidden = this.visible ? "" : "hidden";
}
}
