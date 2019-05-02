/**
A QuestionnaireItemMedia that plays a video.
NOTE: Useful to capture failure to loads.
This item reports as an array video playback statistics [url, duration, stallingCount, replayCount, videoStartTimes, videoPlayDurations].
url corresponds to the array of all sources for this element.
The duration is the total video length in seconds.
stallingCount counts how often a stalling event occured.
replayCount counts how often the video got replayed explicitly by the user.
videoStartTimes are the points in time, relative to creation of the video, when the video started playing.
videoPlayDurations are the times in seconds how long the audio played each time.

@class QuestionnaireItemMediaVideo
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
function QuestionnaireItemMediaVideo(className, question, required, url, readyOnError) {
    QuestionnaireItemMedia.call(this, className, question, required, url, readyOnError);

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: className as " + this.className + ", urls as " + this.height + ", width as " + this.width);

    this.videoNode = null;

    this.videoPlayDurations = []; // Stores how long the video got watched each time
    this.videoCreationTime = null; // Point in time when the video gets created
    this.videoStartTimes = []; // Stores when the video started relative to videoCreationTime
    this.replayCount = 0; // Counts how often the video got replayed explicitly with replay()
}
QuestionnaireItemMediaVideo.prototype = Object.create(QuestionnaireItemMedia.prototype);
QuestionnaireItemMediaVideo.prototype.constructor = QuestionnaireItemMediaVideo;

QuestionnaireItemMediaVideo.prototype._createAnswerNode = function() {
    var node = document.createElement("div");

    this._createMediaNode();

    node.appendChild(this.videoNode);

    this.videoNode.ontimeupdate = this._onprogress.bind(this);
    this.videoNode.onerror = this._onerror.bind(this);
    this.videoNode.onended = this._onended.bind(this);
    this.videoNode.onstalled = this._onstalled.bind(this);
    this.videoNode.onplay = this._onplay.bind(this);

    this.videoCreationTime = new Date().getTime();
    return node;
};

QuestionnaireItemMediaVideo.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.videoPlayDurations.push(this.videoNode.currentTime);
    this._updateAnswer();

    this.videoNode = null;
};

QuestionnaireItemMediaVideo.prototype._loadMedia = function() {
    this._createMediaNode();
};

QuestionnaireItemMediaVideo.prototype._createMediaNode = function() {
    if (this.videoNode !== null) {
        TheFragebogen.logger.debug(this.constructor.name + "()", "audioNode was already created.");
        return;
    }

    this.videoNode = document.createElement('video');
    this.videoNode.oncanplaythrough = this._onloaded.bind(this);

    for (var i = 0; i < this.url.length; i++) {
        var videoSource = document.createElement("source");
        videoSource.src = this.url[i];
        this.videoNode.appendChild(videoSource);
    }

    this.videoNode.src = this.url;

    pTag = document.createElement("p");
    pTag.innerHTML = "This is a fallback content. Your browser does not support the provided video formats.";
    this.videoNode.appendChild(pTag);
};

QuestionnaireItemMediaVideo.prototype.replay = function() {
    this.videoPlayDurations.push(this.videoNode.currentTime);
    this.replayCount += 1;
    this._updateAnswer();

    this.videoNode.pause();
    this.videoNode.currentTime = 0.0;
    this.videoNode.play();
};

QuestionnaireItemMediaVideo.prototype._play = function() {
    if (this.videoNode === null) {
        TheFragebogen.logger.warn(this.constructor.name + "()", "Cannot start playback without this.videoNode.");
        return;
    }

    try {
        this.videoNode.play();
    } catch (e) {
        TheFragebogen.logger.warn(this.constructor.name + "()", "No supported format availble.");
        this._onerror();
    }
};

QuestionnaireItemMediaVideo.prototype._pause = function() {
    if (this.videoNode === null) {
        TheFragebogen.logger.warn(this.constructor.name + "()", "Cannot start playback without this.videoNode.");
        return;
    }
    this.videoNode.pause();
};

QuestionnaireItemMediaVideo.prototype._onprogress = function() {
    //Nope
};

QuestionnaireItemMediaVideo.prototype._onplay = function() {
    this.videoStartTimes.push((new Date().getTime() - this.videoCreationTime) / 1000);
    this._updateAnswer();
};

QuestionnaireItemMediaVideo.prototype._updateAnswer = function() {
    this.answer = [this.url, this.videoNode.duration, this.stallingCount, this.replayCount, this.videoStartTimes, this.videoPlayDurations];
};
