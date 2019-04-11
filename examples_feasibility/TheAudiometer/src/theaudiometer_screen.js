/**
An audiometer for one frequency and one hear.

@class TheAudiometerScreen
@augments Screen

@param {string} [className] CSS class
@param {TheAudiometerCalibration} calibration The object containing the calibration data.
@param {int} frequency The frequency the
@param {int} channel The channel to be used.
@param {int} hearinglevelInitial The hearing level to be used initially.
@param {int} duration The duration in seconds.
*/
function TheAudiometerScreen(className, calibration, frequency, channel, hearinglevelInitial, duration) {
    Screen.call(this);
    this.className = className;
    this._calibration = calibration;
    this._frequency = frequency;
    this._channel = channel;
    this._hearinglevelInitial = hearinglevelInitial;
    this._hearinglevel = this._hearinglevelInitial;
    this._duration = duration;

    this._beepGenerator = new TheAudiometerBeepGenerator(this._frequency, this._channel, (this._handleBeep).bind(this));

    this._startTime = null;

    this._decreaseHearinglevel = false; //True: decrease volume; false: increase decrease volume
    this._data = [];

    this.node = null;
}

TheAudiometerScreen.prototype = Object.create(Screen.prototype);
TheAudiometerScreen.prototype.constructor = TheAudiometerScreen;

TheAudiometerScreen.prototype.createUI = function() {
    this.node = document.createElement("div");
    this.node.style.top = "0px";
    this.node.style.bottom = "0px";
    this.node.className = this.className;

    this.node.onmousedown = function() {
        this._decreaseHearinglevel = true;
    }.bind(this);
    this.node.onmouseup = function() {
        this._decreaseHearinglevel = false;
    }.bind(this);
    TheFragebogen.logger.info(this.constructor.name + "()", "Channel: " + this._channel + ", Frequency: " + this._frequency + " with the following hearing levels " + this._calibration.getHearinglevelAll(this._frequency, this._channel));

    return this.node;
};
TheAudiometerScreen.prototype.releaseUI = function() {
    this.node = null;
    if (!this._beepGenerator.isStopped()) {
        this._stop();
    }
};
TheAudiometerScreen.prototype.start = function() {
    this._startTime = Date.now();
    this._decreaseHearinglevel = false;

    this._beepGenerator.setGain(this._calibration.getGain(this._frequency, this._channel, this._hearinglevel));
    this._beepGenerator.start();
};
TheAudiometerScreen.prototype.getDataCSV = function() {
    return [
        [this.constructor.name, this.constructor.name, this.constructor.name, this.constructor.name, this.constructor.name],
        ['frequency', 'channel', 'initialHearinglevel', 'duration', 'measurement (JSON array)'],
        [],
        [this._frequency, this._channel, this._hearinglevelInitial, this._duration, JSON.stringify(this._data)],
    ];
};

TheAudiometerScreen.prototype._handleBeep = function() {
    this._data.push(this._hearinglevel);

    if (Date.now() - this._startTime > this._duration * 1000) {
        this._stop();
        return;
    }
    TheFragebogen.logger.info(this.constructor.name + "._handleBeep()", (Date.now() - this._startTime) / 1000 + " sec" + " --- Hearinglevel: " + this._hearinglevel + " --- Gain: " + this._beepGenerator.getGain());

    var hearinglevelNext = this._calibration.getHearinglevel(this._decreaseHearinglevel, this._frequency, this._channel, this._hearinglevel);
    if (hearinglevelNext !== undefined) {
        this._hearinglevel = hearinglevelNext;
    } else {
        TheFragebogen.logger.error(this.constructor.name, "Next hearing level not found in calibration data.");
    }

    var gain = this._calibration.getGain(this._frequency, this._channel, this._hearinglevel);
    if (Number.isNaN(gain) === false) {
        this._beepGenerator.setGain(gain);
    } else {
        TheFragebogen.logger.error(this.constructor.name, "Ingnoring gain of " + gain);
    }
};
TheAudiometerScreen.prototype._stop = function() {
    this._beepGenerator.stop();

    this._sendPaginateCallback();
};

/**
Increase the hearinglevel.
*/
TheAudiometerScreen.prototype.increaseHearinglevel = function() {
    if (!this._decreaseHearinglevel) return;

    TheFragebogen.logger.debug(this.constructor.name, "Increase hearing level for following beeps.");
    this._decreaseHearinglevel = false;
};
/**
Increase the hearinglevel.
*/
TheAudiometerScreen.prototype.decreaseHearinglevel = function() {
    if (this._decreaseHearinglevel) return;

    TheFragebogen.logger.debug(this.constructor.name, "Decrease hearing level for following beeps.");
    this._decreaseHearinglevel = true;
};
