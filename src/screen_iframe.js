/**
A screen that shows an iFrame.
Ready is reported after the defined threshold of URL changes occured.

Reports the final URL.
Reports the time between ScreenIFrame.start() and the final URL change, i.e., the one that lead to ready.
ATTENTION: This might be misleading depending on your timing requirements!

ATTENTION: Preloading is not supported.

@class ScreenIFrame
@augments Screen

@param {string} [className] CSS class
@param {string} [url]
@param {number} [urlChangesToReady] Number of URL changes until ready is reported.
*/
function ScreenIFrame(className, url, urlChangesToReady) {
    Screen.call(this);

    this.className = className;

    this.startTime = null;
    this.duration = null;

    this.urlStart = url;
    this.urlFinal = null;

    this.urlChanges = -1;
    this.urlChangesToReady = !isNaN(urlChangesToReady) && urlChangesToReady > 1 ? urlChangesToReady : 1;

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: url as " + this.urlStart + ", urlChangesToReady as" + this.urlChangesToReady);
}
ScreenIFrame.prototype = Object.create(Screen.prototype);
ScreenIFrame.prototype.constructor = ScreenIFrame;

ScreenIFrame.prototype.createUI = function() {
    this.urlChanges = -1; //Ignore the first load
    this.node = document.createElement("iframe");
    this.node.className = this.className;
    this.node.src = this.urlStart;

    this.node.onload = function(event) {
        this.urlChanges += 1;

        TheFragebogen.logger.debug(this.constructor.name + ".iframe.onload():", this.urlStartChanges + " of " + this.maxUrlChanges + " viewed.");

        if (this.urlStartChanges >= this.urlChangesToReady) {
            this.duration = Date.now() - this.startTime;
            this.urlStartChanges = 0;

            try {
                this.urlFinal = event.target.contentWindow.location.href;
            } catch (error) {
                TheFragebogen.logger.warn(this.constructor.name + ".iframe.onload()", "TheFragebogen-Error: Could not get urlFinal from iFrame. Security limitation?");
                this.urlFinal = "TheFragebogen-Error: Could not get urlFinal of the iframe. Security limitation?";
            }
            this._sendPaginateCallback();
        }
    }.bind(this);

    return this.node;
};
ScreenIFrame.prototype.start = function() {
    this.startTime = Date.now();
};
ScreenIFrame.prototype.isReady = function() {
    return this.duration !== null;
};
ScreenIFrame.prototype.releaseUI = function() {
    this.node = null;
    this.startTime = null;
    TheFragebogen.logger.info(this.constructor.name + ".releaseUI()", this.duration);
};
ScreenIFrame.prototype.getDataCSV = function() {
    return [
        ["url", "finalURL", "duration"],
        ["url", "finalURL", "duration"],
        ["", "", ""],
        [this.urlStart, this.urlFinal, this.duration]
    ];
};
