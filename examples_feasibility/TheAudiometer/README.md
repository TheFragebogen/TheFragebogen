TheAudiometer
===

TheAudiometer is a _proof-of-concept_ implementation of a software-based audiometer for [TheFragebogen](http://thefragebogen.de).
An audiometer is a measurement tool to estimate the [absolute hearing threshold](http://en.wikipedia.org/wiki/Absolute_threshold_of_hearing)).
This implementation uses [pure tone audiometry](http://en.wikipedia.org/wiki/Pure_tone_audiometry).

__ATTENTION:__ This is only a _proof-of-concept_ implementation to demonstrate the feasibility.
Before it _could_ be used to get __useful__ measurements, a careful _calibration_ needs to be conducted.
Moreover, _high-end_ audio equipment would be mandatory incl. a pair of headphones suited for audiometry (e.g., Sennheiser HD300).
This also includes measurement equipment to estimate the relationship between and hearing level (e.g., HEAD Accoustics HMV IV).

Implementation
---
TheAudiometer consists of the `TheAudiometerBeepGenerator`, which generates the actual beeps, and the `TheAudiometerScreen` that provides the UI and integration into TheFragebogen.

The beeps (i.e., non-continuous sinus waves) are generated using the [Web Audio API](https://www.w3.org/TR/webaudio/).

__NOTE:__ This is a work-in-progress standard and not yet ready for productive use.
Especially, the definition of _gain_ for volume adjustment is not yet fixed and might vary between browser version.
This _proof-of-concept_ implementation was created and tested with _Firefox 60.6.1esr_.

Authors
---
* Clemens Zimmer
* Dennis Guse, dennis.guse@alumni.tu-berlin.de
