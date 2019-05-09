/**
A QuestionnaireItemMedia that plays a video.
NOTE: Useful to capture failure to loads.

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

    return node;
};

QuestionnaireItemMediaVideo.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

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
    this.videoNode.src = this.url;

    pTag = document.createElement("p");
    pTag.innerHTML = "This is a fallback content. Your browser does not support the provided video formats.";
    this.videoNode.appendChild(pTag);
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
