
TheFragebogen
===

[TheFragebogen](http://www.thefragebogen.de) is a [HTML5](https://de.wikipedia.org/wiki/HTML5) framework for creating stand-alone questionnaires, i.e., running a web browser alone.  
Implemented questionnaires can be loaded from a local file or from a web server.
The collected data can be downloaded to the executing machine or uploaded to a web server.

The Features
---
* Provides a large, extendable set of scales (e.g., [Likert scale](https://en.wikipedia.org/wiki/Likert_scale)).
* Requires only web browser while a web server is optional.
* Supports playback of audio and video.
* Support for free-hand writing or drawing (exported as [PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics)).
* Supports interaction with other systems via [AJAX](https://en.wikipedia.org/wiki/AJAX) or [WebSockets](https://en.wikipedia.org/wiki/WebSocket).

Data is exported as [CSV](http://en.wikipedia.org/wiki/CSV): either as local download or by sending it to a HTTP-server.

Most important TheFragebogen is implemented completely in [JavaScript](https://en.wikipedia.org/wiki/JavaScript).    
It can thus be easily extended and modified while no infrastructure is mandatory (e.g., web server, database, and network connectivity).

Requirements are:

* Requires [JavaScript](https://en.wikipedia.org/wiki/JavaScript)
* (optional) [HTML5 audio](https://en.wikipedia.org/wiki/HTML5_video)
* (optional) [HTML5 video](https://en.wikipedia.org/wiki/HTML5_Audio)
* (optional) [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)
* (optional) [WebSockets](https://en.wikipedia.org/wiki/WebSocket)

__ATTENTION:__ Some features might not be available/usable depending on the web browser features.

Getting started (commands for [Ubuntu 16.10](http://releases.ubuntu.com/16.10/))
---
### Build TheFragebogen:

1. Get source code from [git](https://git-scm.com/) repository: `git clone https://github.com/TheFragebogen/TheFragebogen`
2. Enter repository: `cd TheFragebogen`
3. Install [npm](https://www.npmjs.com/): `sudo apt install npm`
4. Install [grunt](http://gruntjs.com/): `sudo npm install -g grunt-cli`
5. Install dependencies of the project: `npm install`
6. Build the library: `grunt`.
7. Check out the provided examples (see [`examples/`](examples/)).

### Build the documentation:

1. Install [JSdoc](usejsdoc.org): `sudo apt install jsdoc-toolkit`.
2. Build documentation: `grunt doc`.
3. Open documentation in your favorite web browser `doc/index.html`.

The Concept
---
TheFragebogen follows the _paper metaphor_, i.e., a paper-based questionnaire is actually a sequence of paper sheets, which each consists of several items.
Items consist, in fact, of a question and a scale.  
Sheets are represented in TheFragebogen by so-called `Screens` and items by so-called `QuestionnaireItems`.
In TheFragebogen, a questionnaires consists of one or more `Screens` while only one `Screen` is shown at a time.
A `Screen` encapsulates a specific functionality, such as presenting of items, waiting for some time, or exporting data.
For presenting items or HTML content, TheFragebogen provides `ScreenUIElements` that can present generic HTML content (`UIElementHTML`) or items (`QuestionnaireItems`).

The lifecycle of a questionnaire is handled by the `ScreenController`, which organizes the presentation of all `Screens` and also data export.

TheFragebogen is completely implemented using [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming).

__DEVELOPERS:__ Information for developers can be found in [CODING.md](CODING.md).

The Data
---
The data is exported as [CSV](http://en.wikipedia.org/wiki/CSV) while each element is wrapped in quotation marks.

The data consists of *five* columns.

For each row:
* Column *1* contains the index of the screen.
* Column *2* contains the name of the class (for `QuestionnaireItems` or `Screens`).
* Column *3* contains the question (might be empty or a generic identifier).
* Column *4* contains the answer options (might be empty).
* Column *5* contains the answer(s) (might contain an array).

License
---
TheFragebogen is licensed under [MIT License](https://opensource.org/licenses/MIT).
