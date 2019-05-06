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
    @param {string} url The URL of the media element to be loaded; if supported by the browser also data URI.
    @param {boolean} required Element must report ready before continue.
    @param {boolean} [readyOnError=true] Sets ready=true if an error occures.
    */
    constructor(className, question, required, url, readyOnError) {
    super(className, question, required, url, readyOnError);

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: className as " + this.className + ", urls as " + this.height + ", width as " + this.width);

    this.audioNode = null;
    this.progressbar = null;

    this.audioPlayDurations = []; // Stores how long the audio got listend to each time
    this.audioCreationTime = null; // Point in time when the audio gets created
    this.audioStartTimes = []; // Stores when the audio started relative to audioCreationTime
    this.replayCount = 0; // Counts how often the audio got replayed explicitly with replay()
}

_createAnswerNode() {
    var node = document.createElement("div");

    this._createMediaNode();

    this.progressbar = document.createElement("progress");
    node.appendChild(this.progressbar);

    node.appendChild(this.audioNode);

    this.audioNode.ontimeupdate = this._onprogress.bind(this);
    this.audioNode.onerror = this._onerror.bind(this);
    this.audioNode.onended = this._onended.bind(this);
    this.audioNode.onstalled = this._onstalled.bind(this);
    this.audioNode.onplay = this._onplay.bind(this);

    this.audioCreationTime = new Date().getTime();
    return node;
}

releaseUI() {
    super.releaseUI();

    this.audioPlayDurations.push(this.audioNode.currentTime);
    this._updateAnswer();

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
    this.audioNode.oncanplaythrough = this._onloaded.bind(this);

    for (var i = 0; i < this.url.length; i++) {
        var audioSource = document.createElement("source");
        audioSource.src = this.url[i];
        this.audioNode.appendChild(audioSource);
    }

    pTag = document.createElement("p");
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
        TheFragebogen.logger.warn(this.constructor.name + "()", "No supported format availble.");
        this._onerror();
    }
}

_pause() {
    if (this.audioNode === null) {
        TheFragebogen.logger.warn(this.constructor.name + "()", "Cannot start playback without this.audioNode.");
        return;
    }
    this.audioNode.pause();
}

_onprogress() {
    if (this.progressbar && !isNaN(this.audioNode.duration)) {
        this.progressbar.value = (this.audioNode.currentTime / this.audioNode.duration);
    }
}

_onplay() {
    this.audioStartTimes.push((new Date().getTime() - this.audioCreationTime) / 1000);
    this._updateAnswer();
}

_updateAnswer() {
    this.answer = [this.url, this.audioNode.duration, this.stallingCount, this.replayCount, this.audioStartTimes, this.audioPlayDurations];
}
}
