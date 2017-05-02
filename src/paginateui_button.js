/**
Provides a UI for pagination between `Screens`.

Implements a button to continue to the following `Screen`.

@class PaginateUIButton
@augments PaginateUI

@param {string} [className] CSS class
@param {number} [relativeIdNext=undefined] The relativeId of the next screen. If undefined, no back button will be generated.
@param {number} [relativeIdback=undefined] The relativeId of the next screen. If undefined, no back button will be generated.
@param {string} [labelBack="Back"] The caption for the back-button.
@param {string} [labelNext="Next"] The caption for the next-button.
*/
function PaginateUIButton(className, relativeIdBack, relativeIdNext, labelBack, labelNext) {
    PaginateUI.call(this, className);

    this.relativeIdBack = relativeIdBack;
    this.relativeIdNext = relativeIdNext;
    if (this.relativeIdBack === undefined && this.relativeIdNext === undefined) {
        TheFragebogen.logger.error(this.constructor.name + "()", "relativeIdBack and relativeIdNext are undefined. No buttons will be created.");
    }
    if (typeof(this.relativeIdBack) !== "number" && typeof(this.relativeIdNext) !== "number") {
        TheFragebogen.logger.error(this.constructor.name + "()", "relativeIdBack and relativeIdNext should be numbers.");
    }

    this.labelBack = labelBack === undefined ? "Back" : labelBack;
    this.labelNext = labelNext === undefined ? "Next" : labelNext;

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

    if (this.relativeIdBack !== undefined) {
        var buttonBack = document.createElement("input");
        buttonBack.type = "button";
        buttonBack.value = this.labelBack;
        buttonBack.onclick = function() {
            this._sendPaginateCallback(this.relativeIdBack);
        }.bind(this);
        this.node.appendChild(buttonBack);
    }

    if (this.relativeIdNext !== undefined) {
        var buttonNext = document.createElement("input");
        buttonNext.type = "button";
        buttonNext.value = this.labelNext;
        buttonNext.onclick = function() {
            this._sendPaginateCallback(this.relativeIdNext);
        }.bind(this);
        this.node.appendChild(buttonNext);
    }
    return this.node;
};

PaginateUIButton.prototype.releaseUI = function() {
    this.node = null;
};
