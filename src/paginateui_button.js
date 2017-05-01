/**
Provides a UI for pagination between `Screens`.

Implements a button to continue to the following `Screen`.

@class PaginateUIButton
@augments PaginateUI

@param {string} [className] CSS class
*/
function PaginateUIButton(className) {
    PaginateUI.call(this, className);

    this.node = null;
}
PaginateUIButton.prototype = Object.create(PaginateUI.prototype);
PaginateUIButton.prototype.constructor = PaginateUIButton;
/**
@returns {boolean} true if the UI is created, false if not
*/
PaginateUIButton.prototype.isUIcreated = function() {
    return this.uiCreated;
};

PaginateUIButton.prototype.createUI = function() {
    this.node = document.createElement("div");
    this.node.className = this.className;

    var button = document.createElement("input");
    button.type = "button";
    button.value = "Next";
    button.onclick = function() {
        this._sendPaginateCallback();
    }.bind(this);

    this.node.appendChild(button);

    return this.node;
};

PaginateUIButton.prototype.releaseUI = function() {
    this.node = null;
};
