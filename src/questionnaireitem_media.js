/**
A QuestionnaireItemMedia is the base class for QuestionnaireItems that present media, e.g., image, audio, or video.

Playable media start playing automatically if loaded (canplaythrough=true) and `setEnabled(true)`.

@abstract
@class QuestionnaireItemMedia
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem

@param {string} [className] CSS class
@param {string} [question]
@param {boolean} [required=false]
@param {string} url The URL of the media element to be loaded; if supported by the browser also data URI.
@param {boolean} required Element must report ready before continue.
@param {boolean} [readyOnError] Set `ready=true` if an error occures.
*/
function QuestionnaireItemMedia(className, question, required, url, readyOnError) {
    QuestionnaireItem.call(this, className, question, required);

    this.url = url;
    this.isContentLoaded = false;
    this.stallingCount = 0;
    this.wasSuccessfullyPlayed = false;
    this.readyOnError = readyOnError;

    this.errorOccured = false;
}
QuestionnaireItemMedia.prototype = Object.create(QuestionnaireItem.prototype);
QuestionnaireItemMedia.prototype.constructor = QuestionnaireItemMedia;
QuestionnaireItemMedia.prototype.load = function() {
    TheFragebogen.logger.info(this.constructor.name + ".load()", "Start loading for " + this.getURL() + ".");
};

QuestionnaireItemMedia.prototype.isLoaded = function() {
    return this.isContentLoaded;
};

QuestionnaireItemMedia.prototype.isReady = function() {
    if (!this.readyOnError && this.errorOccured) {
        return false;
    }

    return this.isRequired() ? this.wasSuccessfullyPlayed : true;
};

QuestionnaireItemMedia.prototype.getURL = function() {
    return this.url;
};

QuestionnaireItemMedia.prototype.getStallingCount = function() {
    return this.stallingCount;
};

QuestionnaireItemMedia.prototype.setEnabled = function(enabled) {
    if (!this.isUIcreated()) {
        TheFragebogen.logger.warn(this.constructor.name + ".setEnabled()", "Cannot start playback on setEnabled without createUI().");
        return;
    }
    this.enabled = enabled;

    if (enabled) {
        this._play();
    } else {
        this._pause();
    }
};

QuestionnaireItemMedia.prototype.preload = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".preload()", "Start preloading.");

    this.preloaded = false;

    this._loadMedia();
};

QuestionnaireItemMedia.prototype._loadMedia = function() {
    TheFragebogen.logger.warn(this.constructor.name + "._loadMedia()", "This method must be overridden for correct preloading.");
};

//Media-related callbacks
/**
Start playback of playable media.
*/
QuestionnaireItemMedia.prototype._play = function() {
    TheFragebogen.logger.debug(this.constructor.name + "._play()", "This method must be overridden if playback is desired.");
};
/**
Pause playback of playable media.
*/
QuestionnaireItemMedia.prototype._pause = function() {
    TheFragebogen.logger.debug(this.constructor.name + "._pause()", "This method must be overridden if playback is desired.");
};

QuestionnaireItemMedia.prototype._onloading = function() {
    TheFragebogen.logger.info(this.constructor.name + "._onloading()", "This method might be overriden.");
};

QuestionnaireItemMedia.prototype._onloaded = function() {
    TheFragebogen.logger.info(this.constructor.name + "._onloaded()", "Loading done for " + this.getURL() + ".");

    this.isContentLoaded = true;
    this._sendOnPreloadedCallback();

    //Autostart playback?
    if (this.isUIcreated()) {
        this.setEnabled(this.enabled);
    }
};

QuestionnaireItemMedia.prototype._onstalled = function() {
    this.stallingCount += 1;
    this._sendOnPreloadedCallback();

    TheFragebogen.logger.warn(this.constructor.name + "._onstalled()", "Stalling occured (" + this.stallingCount + ") for " + this.getURL());
};

QuestionnaireItemMedia.prototype._onerror = function() {
    this.stallingCount += 1;
    this._sendOnPreloadedCallback();

    TheFragebogen.logger.error(this.constructor.name + "._onerror()", "Stalling occured (" + this.stallingCount + ") for " + this.getURL());
};

QuestionnaireItemMedia.prototype._onprogress = function() {
    TheFragebogen.logger.debug(this.constructor.name + "._onprogress()", "This method must be overridden if progress reporting is desired.");
};

QuestionnaireItemMedia.prototype._onended = function() {
    TheFragebogen.logger.info(this.constructor.name + "._onended", "Playback finished.");

    this.wasSuccessfullyPlayed = true;
    this.setAnswer(this.getData());

    this._sendReadyStateChanged();
    this.markRequired();
};

QuestionnaireItemMedia.prototype.setAnswer = function(answer) {
    this.answer = answer;
};

QuestionnaireItemMedia.prototype.getData = function() {
    return [this.url, this.time];
};

QuestionnaireItemMedia.prototype._checkData = function(data) {
    return (data[0] === this.getURL()) && (data[1] === this.getStallingCount());
};

QuestionnaireItemMedia.prototype.setData = function(data) {
    return this._checkData(data);
};
