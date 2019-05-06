/**
Provides access to calibration data.

@class TheAudiometerCalibration
*/
class TheAudiometerCalibration {

    /**
    @param {Map<int, Map<int, Map<int, int>>>} calibrationData The calibration to be used as nested map: channel -> frequency -> hearinglevel -> gain
    */
    constructor(calibrationData) {
    this._calibrationData = calibrationData;
}

/**
Lookup the gain for this channel, frequency and hearing level.
@param {int} frequency
@param {int} channel
@param {int} hearinglevel
@return {float|NaN} The gain.
*/
getGain(frequency, channel, hearinglevel) {
    const calibrationDataChannelFrequency = this._getChannelFrequency(frequency, channel);
    const gain = calibrationDataChannelFrequency[hearinglevel];
    if (gain === undefined) {
        TheFragebogen.logger.error(this.constructor.name + ".getGain()", "Could not find calibration data for channel: " + channel + ", frequency: " + frequency + ", and hearing level " + hearinglevel);
        return NaN;
    }
    if (!Number.isFinite(gain)) {
        TheFragebogen.logger.error(this.constructor.name + ".getGain()", "Could not find calibration data for channel: " + channel + ", frequency: " + frequency + ", and hearing level " + hearinglevel);
        return NaN;
    }
    return gain;
}

/**
Get the next hearing level to be presented (either increase or decrease).
@param {boolean} decreaseHearinglevel Should the hearing level be decreased or increased?
@param {int} frequency
@param {int} channel
@param {int} hearinglevel
@return {int|NaN} The next hearing level.
*/
getHearinglevel(decreaseHearinglevel, frequency, channel, hearinglevel) {
    const calibrationDataHearinglevel = this._getChannelFrequency(frequency, channel);
    if (calibrationDataHearinglevel === undefined) {
        TheFragebogen.logger.error(this.constructor.name + ".getHearinglevel()", "Could not find calibration data for channel: " + channel + ", frequency: " + frequency + ", and hearing level " + hearinglevel);
        return NaN;
    }

    const hearinglevelSorted = Object.keys(calibrationDataHearinglevel).map(e => parseInt(e)).sort((a, b) => a - b);
    const hearinglevelIndex = hearinglevelSorted.findIndex(e => e === hearinglevel);
    if (hearinglevelIndex == -1) {
        TheFragebogen.logger.error(this.constructor.name + ".getHearinglevel()", "Hearing level " + hearinglevel + " is not configured.");
        return hearinglevel;
    }

    const hearinglevelNextIndex = decreaseHearinglevel ? hearinglevelIndex - 1 : hearinglevelIndex + 1;
    if (hearinglevelNextIndex < 0) {
        TheFragebogen.logger.warn(this.constructor.name + ".getHearinglevel()", "Minimal hearing level reached.");
        return hearinglevel;
    }
    if (hearinglevelNextIndex >= hearinglevelSorted.length) {
        TheFragebogen.logger.warn(this.constructor.name + ".getHearinglevel()", "Maximal hearing level reached.");
        return hearinglevel;
    }

    return hearinglevelSorted[hearinglevelNextIndex];
}

/**
Get all hearing levels for a channel and a frequency.
@param {int} frequency
@param {int} channel
@return {array<float>} All hearing levels.
*/
getHearinglevelAll(frequency, channel) {
    const calibrationDataHearinglevel = this._getChannelFrequency(frequency, channel);
    if (calibrationDataHearinglevel === undefined) {
        TheFragebogen.logger.error(this.constructor.name + ".getHearinglevel()", "Could not find calibration data for channel: " + channel + ", frequency: " + frequency + ", and hearing level " + hearinglevel);
        return [NaN];
    }

    return Object.keys(calibrationDataHearinglevel).map(e => parseInt(e)).sort((a, b) => a - b);
}

_getChannelFrequency(frequency, channel) {
    const calibrationDataChannel = this._calibrationData[channel];
    if (calibrationDataChannel === undefined) {
        TheFragebogen.logger.error(this.constructor.name + "._getChannelFrequency()", "Could not find calibration data for channel: " + channel);
        return NaN;
    }

    const calibrationDataFrequency = calibrationDataChannel[frequency];
    if (calibrationDataChannel === undefined) {
        TheFragebogen.logger.error(this.constructor.name + "._getChannelFrequency()", "Could not find calibration data for channel: " + channel + "and frequency: " + frequency);
        return NaN;
    }
    return calibrationDataFrequency;
}
}
