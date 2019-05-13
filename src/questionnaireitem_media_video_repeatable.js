/**
A QuestionnaireItemMediaVideo that adds a repeat button to the video
NOTE: Useful to capture failure to loads.
This item reports as an array video playback statistics [url, duration, stallingCount, replayCount, videoStartTimes, videoPlayDurations].
url corresponds to the array of all sources for this element.
The duration is the total video length in seconds.
stallingCount counts how often a stalling event occured.
replayCount counts how often the video got replayed explicitly by the user.
videoStartTimes are the points in time, relative to creation of the video, when the video started playing.
videoPlayDurations are the times in seconds how long the audio played each time.

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
        button.onclick = this._onReplayClick.bind(this);

        div.appendChild(button);
        answerNode.appendChild(div);

        return answerNode;
    }

    _onReplayClick() {
        this.replay();
    }
}
