/**
A UIElement that shows non-interactive UI, i.e., plain HTML.
Provided HTML is encapsulated into a div and div.className is set.

@class UIElementHTML
@augments UIElement

@param {string} [className] CSS class
@param {string} html HTML
*/
function UIElementHTML(className, html) {
    UIElement.call(this);

    this.className = className;
    this.html = html;

    this.node = null;

    TheFragebogen.logger.debug(this.constructor.name + "()", "className as " + this.className + " and html as " + this.html);
}
UIElementHTML.prototype = Object.create(UIElement.prototype);
UIElementHTML.prototype.constructor = UIElementHTML;

UIElementHTML.prototype.createUI = function() {
    this.node = document.createElement("div");
    this.node.className = this.className;
    this.node.innerHTML = this.html;

    return this.node;
};

UIElementHTML.prototype.releaseUI = function() {
    this.node = null;
};

UIElementHTML.prototype.setEnabled = function(enabled) {
    //NOPE
};

/**
Returns the HTML
@returns {array} html data stored in the index 0 of the array
*/
UIElementHTML.prototype.getData = function() {
    return [this.html];
};

UIElementHTML.prototype._checkData = function(data) {
    return data[0] === this.html;
};

UIElementHTML.prototype.setData = function(data) {
    return this._checkData(data);
};

UIElementHTML.prototype.setVisible = function(visible) {
    this.visible = visible;
    this.node.hidden = this.visible ? "" : "hidden";
};
