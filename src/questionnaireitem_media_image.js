/**
A QuestionnaireItemMedia that displays an image.
NOTE: Useful to capture failure to loads.

@class QuestionnaireItemMediaImage
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemMedia

@param {string} [className] CSS class
@param {string} [question]
@param {boolean} [required=false]
@param {string} url The URL of the media element to be loaded; if supported by the browser also data URI.
@param {boolean} required Element must report ready before continue.
@param {boolean} [readyOnError=true] Sets ready=true if an error occures.
*/
function QuestionnaireItemMediaImage(className, question, required, url, readyOnError) {
    QuestionnaireItemMedia.call(this, className, question, required, url, readyOnError);

    TheFragebogen.logger.debug("QuestionnaireItemMediaImage()", "Set: className as " + this.className + ", height as " + this.height + ", width as " + this.width);

    this.imageNode = null;
}
QuestionnaireItemMediaImage.prototype = Object.create(QuestionnaireItemMedia.prototype);
QuestionnaireItemMediaImage.prototype.constructor = QuestionnaireItemMediaImage;

QuestionnaireItemMediaImage.prototype._createAnswerNode = function() {
    var node = document.createElement("div");

    this._createMediaNode();

    node.appendChild(this.imageNode);

    return node;
};

QuestionnaireItemMediaImage.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.imageNode = null;
};

QuestionnaireItemMediaImage.prototype._loadMedia = function() {
    this._createMediaNode();
};

QuestionnaireItemMediaImage.prototype._createMediaNode = function() {
    if (this.imageNode !== null) {
        TheFragebogen.logger.debug("QuestionnaireItemMediaImage()", "Images was already created.");
        return;
    }

    this.imageNode = new Image();
    this.imageNode.onload = this._onloaded.bind(this);
    this.imageNode.src = this.url;
};
