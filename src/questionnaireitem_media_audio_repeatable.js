/**
A QuestionnaireItemMediaAudio that adds a repeat button to the audio
NOTE: Useful to capture failure to loads.
This item reports as an array audio playback statistics [url, duration, stallingCount, replayCount, audioStartTimes, audioPlayDurations].
url corresponds to the array of all sources for this element.
The duration is the total audio length in seconds.
stallingCount counts how often a stalling event occured.
replayCount counts how often the audio got replayed explicitly by the user.
audioStartTimes are the points in time, relative to creation of the audio, when the audio started playing.
audioPlayDurations are the times in seconds how long the audio played each time.

@class QuestionnaireItemMediaAudioRepeatable
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemMedia
@augments QuestionnaireItemMediaAudio
*/
class QuestionnaireItemMediaAudioRepeatable extends QuestionnaireItemMediaAudio {

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
