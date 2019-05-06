/**
Creates reoccuring beeps (sinus) on one channel (usually left or right).
After each beep a callback function (if provided) is called.
Implementation uses the WebAudio API.

The beep resembles DIN EN 60645-1 p. 27.

WebAudio components:
* this._audioOscillator (Oscillator) -> this._audioGain (Gain) -> this._audioMerger (ChannelMerger) -> destination (Sink, 2 channel)
* NONE                               -> this._gainDummy (Gain) ->
this._gainDummy is required to enforce stereo output (i.e., one channel silent).

If a lower boundary for this._audioGain.gain is reached, a second GainNode could be used in addition.

@class TheAudiometerBeepGenerator
*/
class TheAudiometerBeepGenerator {

    /**
    @param {int} frequency The frequency of the beeps.
    @param {int} channel The channel (index) to be used.
    @param {function} afterBeepCallback A callback function to be called after each beeps.
    */
    constructor(frequency, channel, afterBeepCallback) {
    this._frequency = frequency;
    this._channel = channel; //0: Left? 1:Right?

    if (!(afterBeepCallback instanceof Function)) {
        console.error("afterBeepCallback is not a function!");
        afterBeepCallback = function() {};
    }
    this._afterBeepCallback = afterBeepCallback;

    this._scheduleNextBeep = true;

    this._gain = 0;

    //Setup audio infrastructure
    this._audioContext = new AudioContext();

    this._audioMerger = this._audioContext.createChannelMerger(2);
    this._audioMerger.connect(this._audioContext.destination);

    this._audioGain = this._audioContext.createGain();
    this._audioGain.connect(this._audioMerger, 0, this._channel);

    this._gainDummy = this._audioContext.createGain();
    this._gainDummy.connect(this._audioMerger, 0, (this._channel + 1) % 2);

    this._audioOscillator = null;
}

_beeping() {
    this._afterBeepCallback();

    if (!this._scheduleNextBeep) {
        TheFragebogen.logger.debug(this.constructor.name, "Last beep played.");
        this._audioContext.close();
        return;
    }

    TheFragebogen.logger.debug(this.constructor.name, "Next beep with " + this.getFrequency() + "Hz and gain " + this.getGain());

    this._audioOscillator = this._audioContext.createOscillator();
    this._audioOscillator.connect(this._audioGain);

    this._audioOscillator.onended = (this._beeping).bind(this);

    this._audioOscillator.frequency.value = this._frequency;

    const startTime = this._audioContext.currentTime;

    //Here we actually produce the beep (DIN EN 60645-1 p. 27)
    this._audioOscillator.start(startTime);
    this._audioGain.gain.setValueAtTime(0, startTime);
    this._audioGain.gain.linearRampToValueAtTime(this._gain, startTime + 0.05);
    // beep length must be more than 150 ms (we take 0.2s)
    this._audioGain.gain.setValueAtTime(this._gain, startTime + 0.05 + 0.2);
    // ramp length 20 - 50ms (choose 40ms)
    this._audioGain.gain.linearRampToValueAtTime(0, startTime + 0.05 + 0.2 + 0.05);
    this._audioOscillator.stop(startTime + 0.05 + 0.2 + 0.05 + 0.2);
}

start() {
    if (!this._scheduleNextBeep) {
        TheFragebogen.logger.error(this.constructor.name, "Cannot be reused. Please create a new one.");
        return;
    }
    this._scheduleNextBeep = true;
    this._beeping();
}

stop() {
    this._scheduleNextBeep = false;
}

isStopped() {
    return !this._scheduleNextBeep;
}

getFrequency() {
    return this._frequency;
}

getGain() {
    return this._gain;
}

setGain(gain) {
    this._gain = gain;
}
}
