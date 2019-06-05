/**
A QuestionnaireItemMedia is the base class for QuestionnaireItems that present media, e.g., image, audio, or video.

Playable media start playing automatically if loaded (canplaythrough=true) and `setEnabled(true)`.

ATTENTION: answer is stored on calling releaseUI() and (if UI is created) getAnswer() only.

@abstract
@class QuestionnaireItemMedia
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemMedia extends QuestionnaireItem {

    /**
    @param {string} [className] CSS class
    @param {string} [question]
    @param {boolean} [required=false]
    @param {string|array} url The URL of the media element to be loaded; if supported by the browser also data URI. A single resource can be provided as string or multiple resources of different formats as an array.
    @param {boolean} required Element must report ready before continue.
    @param {boolean} [readyOnError] Set `ready=true` if an error occures.
    */
    constructor(className, question, required, url, readyOnError) {
        super(className, question, required);

        this.url = Array.isArray(url) ? url : [url];
        this.isContentLoaded = false;
        this.stallingCount = 0;
        this.wasSuccessfullyPlayed = false;
        this.readyOnError = readyOnError;

        this.errorOccured = false;
    }

    load() {
        TheFragebogen.logger.info(this.constructor.name + ".load()", "Start loading for " + this.getURL() + ".");
    }

    isLoaded() {
        return this.isContentLoaded;
    }

    isReady() {
        if (!this.readyOnError && this.errorOccured) {
            return false;
        }

        return this.isRequired() ? this.wasSuccessfullyPlayed : true;
    }

    getURL() {
        return this.url;
    }

    setEnabled(enabled) {
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
    }

    applyAnswerToUI() {
        //NOPE
    }

    releaseUI() {
        super.releaseUI();
        this._updateAnswer();
    }

    getAnswer() {
        if (this.isUIcreated()) {
            this._updateAnswer();
        }

        return super.getAnswer();
    }

    setAnswer(answer) {
        //NOTE: Omit calling super.setAnswer() as getAnswer() also triggers setAnswer() leading to recursion.
        this.answer = answer;
    }

    preload() {
        TheFragebogen.logger.debug(this.constructor.name + ".preload()", "Start preloading.");

        this.preloaded = false;

        this._loadMedia();
    }

    _loadMedia() {
        TheFragebogen.logger.warn(this.constructor.name + "._loadMedia()", "This method must be overridden for correct preloading.");
    }

    //Media-related callbacks
    /**
    Start playback of playable media.
    */
    _play() {
        TheFragebogen.logger.debug(this.constructor.name + "._play()", "This method must be overridden if playback is desired.");
    }

    /**
    Pause playback of playable media.
    */
    _pause() {
        TheFragebogen.logger.debug(this.constructor.name + "._pause()", "This method must be overridden if playback is desired.");
    }

    _onLoading() {
        TheFragebogen.logger.info(this.constructor.name + "._onloading()", "This method might be overriden.");
    }

    _onLoaded() {
        TheFragebogen.logger.info(this.constructor.name + "._onloaded()", "Loading done for " + this.getURL() + ".");

        if (!this.isContentLoaded) {
            this.isContentLoaded = true;
            this._sendOnPreloadedCallback();
        }

        //Autostart playback?
        if (this.isUIcreated()) {
            this.setEnabled(this.enabled);
        }
    }

    _onStalled(event) {
        this.stallingCount += 1;
        this._sendOnPreloadedCallback();

        TheFragebogen.logger.warn(this.constructor.name + "._onstalled()", "Stalling occured (" + this.stallingCount + ") for " + this.getURL());
    }

    _onError(event) {
        this.stallingCount += 1;
        this._sendOnPreloadedCallback();

        TheFragebogen.logger.error(this.constructor.name + "._onerror()", "Stalling occured (" + this.stallingCount + ") for " + this.getURL());
    }

    _onProgress(event) {
        TheFragebogen.logger.debug(this.constructor.name + "._onprogress()", "This method must be overridden if progress reporting is desired.");
    }

    _onEnded() {
        TheFragebogen.logger.info(this.constructor.name + "._onended", "Playback finished.");

        this.wasSuccessfullyPlayed = true;

        this._sendReadyStateChanged();
        this.markRequired();
    }

    /**
    Overwrite this method to add additional data to be reported.
    */
    _updateAnswer() {
        this.setAnswer([this.url, this.time]);
    }
}
