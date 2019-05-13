/**
A QuestionnaireItemMediaVideo that adds a repeat button to the video.
For other details see {@link QuestionnaireItemMediaVideo}.

@class QuestionnaireItemMediaVideoRepeatable
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemMedia
@augments QuestionnaireItemMediaVideo
*/
class QuestionnaireItemMediaVideoRepeatable extends QuestionnaireItemMediaVideo {

    /**
    @param {string} [className] CSS class
    @param {string} [question]
    @param {boolean} [required=false]
    @param {string|array<string>} url The URL of the media element to be loaded; if supported by the browser also data URI.
    @param {boolean} required Element must report ready before continue.
    @param {boolean} [readyOnError=true] Sets ready=true if an error occures.
    @param {string} buttonCaption The string shown in the replay button.
    */
    constructor(className, question, required, url, readyOnError, buttonCaption) {
        super(className, question, required, url, readyOnError);

        this.buttonCaption = buttonCaption;
    }

    _createAnswerNode() {
        const answerNode = super._createAnswerNode();

        var div = document.createElement("div");
        var button = document.createElement("button");
        button.innerHTML = this.buttonCaption;
        button.onclick = () => this._onReplayClick();

        div.appendChild(button);
        answerNode.appendChild(div);

        return answerNode;
    }

    _onReplayClick() {
        this.replay();
    }
}
