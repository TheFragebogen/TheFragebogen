/**
A screen that downloads the currently stored data of the questionnaire in CSV format as a file.
A message is presented while uploading.
Default timeout: 300s; should not be relevant.

@class ScreenWaitDataDownload
@augments Screen
@augments ScreenWait
@augments ScreenWaitData
*/
class ScreenWaitDataDownload extends ScreenWaitData {

    /**
    @param {string} [className] CSS class
    @param {string} [message="Downloading data"] Message to be displayed.
    @param {string} [filename="TheFragebogen.csv"] Name of the file to be downloaded
    @param {boolean} [includeAnswerChangelog=false] Should the the changelog of the answer be reported?
    */
    constructor(className, message, filename, includeAnswerChangelog) {
        super(className, 300, typeof(message) === "string" ? message : "Downloading data", includeAnswerChangelog);

        this.filename = (typeof(filename) === "string" ? filename : "TheFragebogen.csv");

        TheFragebogen.logger.debug(this.constructor.name + "()", "Set: filename as " + this.filename);
    }

    createUI() {
        this.node = document.createElement("div");
        this.applyCSS();

        const span = document.createElement("span");
        span.innerHTML = this.html;
        this.node.appendChild(span);

        return this.node;
    }

    /**
    On start(), the screenController.requestDataCSV() is called with this.callbackDownload() as callback.
    ScreenController needs to set the callback accordingly.
    */
    start() {
        this._sendGetDataCallback();
        this.callbackDownload(this.data);
    }

    /**
    Callback to download data.
    @param {string} data
    */
    callbackDownload(data) {
        TheFragebogen.logger.info(this.constructor.name + ".callbackDownload()", data);
        downloadData(this.filename, data);
        this._sendPaginateCallback();
    }
}
