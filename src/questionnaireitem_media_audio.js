/**
A QuestionnaireItemMedia that plays an audio file.
NOTE: Useful to capture failure to loads.
This item reports as an array audio playback statistics [url, duration, stallingCount, replayCount, audioStartTimes, audioPlayDurations].
url corresponds to the array of all sources for this element.
The duration is the total audio length in seconds.
stallingCount counts how often a stalling event occured.
replayCount counts how often the audio got replayed explicitly by the user.
audioStartTimes are the points in time, relative to creation of the audio, when the audio started playing.
audioPlayDurations are the times in seconds how long the audio played each time.

@class QuestionnaireItemMediaAudio
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemMedia
*/
class QuestionnaireItemMediaAudio extends QuestionnaireItemMedia {

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

        this.audioNode = null;
        this.progressbar = null;

        this.audioPlayDurations = []; // Stores how long the audio got listend to each time
        this.audioCreationTime = null; // Point in time when the audio gets created
        this.audioStartTimes = []; // Stores when the audio started relative to audioCreationTime
        this.replayCount = 0; // Counts how often the audio got replayed explicitly with replay()
    }

    _createAnswerNode() {
        const answerNode = document.createElement("div");

        this._createMediaNode();
        this.audioCreationTime = new Date().getTime(); // Before play event listener gets set

        this.progressbar = document.createElement("progress");
        answerNode.appendChild(this.progressbar);

        answerNode.appendChild(this.audioNode);

        this.audioNode.addEventListener("timeupdate", (event) => this._onProgress(event));
        this.audioNode.addEventListener("error", (event) => this._onError(event));
        this.audioNode.addEventListener("ended", () => this._onEnded());
        this.audioNode.addEventListener("stalled", () => this._onStalled());
        this.audioNode.addEventListener("play", () => this._onPlay());

        return answerNode;
    }

    releaseUI() {
        this.audioPlayDurations.push(this.audioNode.currentTime);
        super.releaseUI();

        this.audioNode = null;
        this.progressbar = null;
    }

    _loadMedia() {
        this._createMediaNode();
    }

    _createMediaNode() {
        if (this.audioNode !== null) {
            TheFragebogen.logger.debug(this.constructor.name + "()", "audioNode was already created.");
            return;
        }

        this.audioNode = new Audio();
        this.audioNode.addEventListener("canplaythrough", () => this._onLoaded());

        for (let i = 0; i < this.url.length; i++) {
            const audioSource = document.createElement("source");
            audioSource.src = this.url[i];
            this.audioNode.appendChild(audioSource);
        }

        let pTag = document.createElement("p");
        pTag.innerHTML = "This is a fallback content. Your browser does not support the provided audio formats.";
        this.audioNode.appendChild(pTag);
    }

    replay() {
        this.audioPlayDurations.push(this.audioNode.currentTime);
        this.replayCount += 1;
        this._updateAnswer();

        this.audioNode.pause();
        this.audioNode.currentTime = 0.0;
        this.audioNode.play();
    }

    _play() {
        if (this.audioNode === null) {
            TheFragebogen.logger.warn(this.constructor.name + "()", "Cannot start playback without this.audioNode.");
            return;
        }
        try {
            this.audioNode.play();
        } catch (e) {
            TheFragebogen.logger.warn(this.constructor.name + "()", "No supported format available.");
            this._onError();
        }
    }

    _pause() {
        if (this.audioNode === null) {
            TheFragebogen.logger.warn(this.constructor.name + "()", "Cannot start playback without this.audioNode.");
            return;
        }
        this.audioNode.pause();
    }

    _onProgress() {
        if (this.progressbar && !isNaN(this.audioNode.duration)) {
            this.progressbar.value = (this.audioNode.currentTime / this.audioNode.duration);
        }
    }

    _onPlay() {
        this.audioStartTimes.push((new Date().getTime() - this.audioCreationTime) / 1000);
        this._updateAnswer();
    }

    _updateAnswer() {
        this.setAnswer([this.url, this.audioNode.duration, this.stallingCount, this.replayCount, this.audioStartTimes, this.audioPlayDurations]);
    }
}
