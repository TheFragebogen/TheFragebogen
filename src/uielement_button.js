/**
A UIElement that shows a button.
The provided callback function gets called if a onclick event occurs on this button.

@class UIElementButton
@augments UIElement

@param {string} [className] CSS class
@param {string} caption Caption of the button
@param {method} actionCallback Callback function for onclick event
*/
function UIElementButton(className, caption, actionCallback) {
    UIElement.call(this);

    this.className = className;
    this.caption = caption;
    this.actionCallback = actionCallback;

    this.node = null;
    this.button = null;

    TheFragebogen.logger.debug(this.constructor.name + "()", "className as " + this.className + " and caption as " + this.caption);
}
UIElementButton.prototype = Object.create(UIElement.prototype);
UIElementButton.prototype.constructor = UIElementButton;

UIElementButton.prototype.createUI = function() {
    this.node = document.createElement("div");
    this.node.className = this.className;

    this.button = document.createElement("button");
    this.button.innerHTML = this.caption;
    this.button.onclick = this._onclick.bind(this);

    this.node.appendChild(this.button);
    return this.node;
};

UIElementButton.prototype.releaseUI = function() {
    this.node = null;
    this.button = null;
};

UIElementButton.prototype.setEnabled = function(enabled) {
    this.button.disabled = !enabled;
};

UIElementButton.prototype._onclick = function() {
    if (this.actionCallback) {
        this.actionCallback();
    }
};

/**
Returns the caption
@returns {array} caption data stored in the index 0 of the array
*/
UIElementButton.prototype.getData = function() {
    return [this.caption];
};

UIElementButton.prototype._checkData = function(data) {
    return data[0] === this.caption;
};

UIElementButton.prototype.setData = function(data) {
    return this._checkData(data);
};

UIElementButton.prototype.setVisible = function(visible) {
    this.visible = visible;
    this.node.className.hidden = visible ? "" : "hidden";
};
