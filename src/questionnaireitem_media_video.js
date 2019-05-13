/**
A QuestionnaireItemMedia that plays a video.
NOTE: Useful to capture failure to loads.
This item reports as an array video playback statistics [url, duration, stallingCount, replayCount, videoStartTimes, videoPlayDurations].
url corresponds to the array of all sources for this element.
The duration is the total video length in seconds.
stallingCount counts how often a stalling event occured.
replayCount counts how often the video got replayed explicitly by the user.
videoStartTimes are the points in time, relative to creation of the video, when the video started playing.
videoPlayDurations are the times in seconds how long the video played each time.

@class QuestionnaireItemMediaVideo
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemMedia
*/
class QuestionnaireItemMediaVideo extends QuestionnaireItemMedia {

    /**
    @param {string} [className] CSS class
    @param {string} [question]
    @param {boolean} [required=false]
    @param {string|array<string>} url The URL of the media element to be loaded; if supported by the browser also data URI.
    @param {boolean} required Element must report ready before continue.
    @param {boolean} [readyOnError=true] Sets ready=true if an error occures.
    @param {boolean} [videoPlaysInline=false] Play video within parent element.
    */
    constructor(className, question, required, url, readyOnError, videoPlaysInline) {
        super(className, question, required, url, readyOnError);

        this.videoNode = null;

        this.videoPlayDurations = []; // Stores how long the video got watched each time
        this.videoCreationTime = null; // Point in time when the video gets created
        this.videoStartTimes = []; // Stores when the video started relative to videoCreationTime
        this.replayCount = 0; // Counts how often the video got replayed explicitly with replay()
        this.videoPlaysInline = videoPlaysInline;
    }

    _createAnswerNode() {
        const answerNode = document.createElement("div");

        this._createMediaNode();
        this.videoCreationTime = new Date().getTime(); // Before play event listener gets set

        answerNode.appendChild(this.videoNode);

        this.videoNode.addEventListener("timeupdate", (event) => this._onProgress(event));
        this.videoNode.addEventListener("error", (event) => this._onError(event));
        this.videoNode.addEventListener("ended", () => this._onEnded());
        this.videoNode.addEventListener("stalled", () => this._onStalled());
        this.videoNode.addEventListener("play", this._onPlay());

        return answerNode;
    }

    releaseUI() {
        this.videoPlayDurations.push(this.videoNode.currentTime);
        super.releaseUI();

        this.videoNode = null;
    }

    _loadMedia() {
        this._createMediaNode();
    }

    _createMediaNode() {
        if (this.videoNode !== null) {
            TheFragebogen.logger.debug(this.constructor.name + "()", "videoNode was already created.");
            return;
        }

        this.videoNode = document.createElement('video');
        if (this.videoPlaysInline) {
            // Play video within parent element
            this.videoNode.setAttribute("playsinline", "");
        }
        this.videoNode.addEventListener("canplaythrough", () => this._onLoaded());

        for (let i = 0; i < this.url.length; i++) {
            const videoSource = document.createElement("source");
            videoSource.src = this.url[i];
            this.videoNode.appendChild(videoSource);
        }

        let pTag = document.createElement("p");
        pTag.innerHTML = "This is a fallback content. Your browser does not support the provided video formats.";
        this.videoNode.appendChild(pTag);
    }

    replay() {
        this.videoPlayDurations.push(this.videoNode.currentTime);
        this.replayCount += 1;

        this.videoNode.pause();
        this.videoNode.currentTime = 0.0;
        this.videoStartTimes.push((new Date().getTime() - this.videoCreationTime) / 1000);
        this.videoNode.play();

        this._updateAnswer();
    }

    _play() {
        if (this.videoNode === null) {
            TheFragebogen.logger.warn(this.constructor.name + "()", "Cannot start playback without this.videoNode.");
            return;
        }

        try {
            this.videoNode.play();
        } catch (e) {
            TheFragebogen.logger.warn(this.constructor.name + "()", "No supported format availble.");
            this._onError();
        }
    }

    _pause() {
        if (this.videoNode === null) {
            TheFragebogen.logger.warn(this.constructor.name + "()", "Cannot start playback without this.videoNode.");
            return;
        }
        this.videoNode.pause();
    }

    _onProgress() {
        //Nope
    }

    _onPlay() {
        this.videoStartTimes.push((new Date().getTime() - this.videoCreationTime) / 1000);
    }

    _updateAnswer() {
        this.setAnswer([this.url, this.videoNode.duration, this.stallingCount, this.replayCount, this.videoStartTimes, this.videoPlayDurations]);
    }
}
