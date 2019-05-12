/**
A QuestionnaireItemMedia that displays an image.
NOTE: Useful to capture failure to loads.

@class QuestionnaireItemMediaImage
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemMedia
*/
class QuestionnaireItemMediaImage extends QuestionnaireItemMedia {

    /**
    @param {string} [className] CSS class
    @param {string} [question]
    @param {boolean} [required=false]
    @param {string|array<string>} url The URL of the media element to be loaded; if supported by the browser also data URI.
    @param {boolean} required Element must report ready before continue.
    @param {boolean} [readyOnError=true] Sets ready=true if an error occures.
    */
    constructor(className, question, required, url, readyOnError) {
        super(className, question, required, url, readyOnError);

        if (this.url.length != 1) {
            TheFragebogen.logger.warn("QuestionnaireItemMediaImage()", "called with multiple resources as url. Falling back to the first element in the array.");
        }

        this.imageNode = null;
    }

    _createAnswerNode() {
        const answerNode = document.createElement("div");

        this._createMediaNode();

        answerNode.appendChild(this.imageNode);

        return answerNode;
    }

    releaseUI() {
        super.releaseUI();

        this.imageNode = null;
    }

    _loadMedia() {
        this._createMediaNode();
    }

    _createMediaNode() {
        if (this.imageNode !== null) {
            TheFragebogen.logger.debug("QuestionnaireItemMediaImage()", "Images was already created.");
            return;
        }

        this.imageNode = new Image();
        this.imageNode.addEventListener("load", () => this._onLoaded());
        this.imageNode.src = this.url[0];
    }
}
