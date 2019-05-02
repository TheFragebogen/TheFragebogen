/**
A QuestionnaireItemMedia that plays an audio file.
NOTE: Useful to capture failure to loads.

@class QuestionnaireItemMediaAudio
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
function QuestionnaireItemMediaAudio(className, question, required, url, readyOnError) {
    QuestionnaireItemMedia.call(this, className, question, required, url, readyOnError);

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: className as " + this.className + ", urls as " + this.height + ", width as " + this.width);

    this.audioNode = null;
    this.progressbar = null;
}
QuestionnaireItemMediaAudio.prototype = Object.create(QuestionnaireItemMedia.prototype);
QuestionnaireItemMediaAudio.prototype.constructor = QuestionnaireItemMediaAudio;

QuestionnaireItemMediaAudio.prototype._createAnswerNode = function() {
    var node = document.createElement("div");

    this._createMediaNode();

    this.progressbar = document.createElement("progress");
    node.appendChild(this.progressbar);

    node.appendChild(this.audioNode);

    this.audioNode.ontimeupdate = this._onprogress.bind(this);
    this.audioNode.onerror = this._onerror.bind(this);
    this.audioNode.onended = this._onended.bind(this);

    return node;
};

QuestionnaireItemMediaAudio.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.audioNode = null;
    this.progressbar = null;
};

QuestionnaireItemMediaAudio.prototype._loadMedia = function() {
    this._createMediaNode();
};

QuestionnaireItemMediaAudio.prototype._createMediaNode = function() {
    if (this.audioNode !== null) {
        TheFragebogen.logger.debug(this.constructor.name + "()", "audioNode was already created.");
        return;
    }

    this.audioNode = new Audio();
    this.audioNode.oncanplaythrough = this._onloaded.bind(this);
    this.audioNode.src = this.url;

    for (var i = 0; i < this.url.length; i++) {
        audioSource = document.createElement("source");
        audioSource.src = this.url[i];
        this.audioNode.appendChild(audioSource);
    }
};

QuestionnaireItemMediaAudio.prototype._play = function() {
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
};

QuestionnaireItemMediaAudio.prototype._pause = function() {
    if (this.audioNode === null) {
        TheFragebogen.logger.warn(this.constructor.name + "()", "Cannot start playback without this.audioNode.");
        return;
    }
    this.audioNode.pause();
};

QuestionnaireItemMediaAudio.prototype._onprogress = function() {
    if (this.progressbar && !isNaN(this.audioNode.duration)) {
        this.progressbar.value = (this.audioNode.currentTime / this.audioNode.duration);
    }
};
