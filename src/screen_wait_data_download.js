/**
A screen that downloads the currently stored data of the questionnaire in CSV format as a file.
A message is presented while uploading.
Default timeout: 300s; should not be relevant.

@class ScreenWaitDataDownload
@augments Screen
@augments ScreenWait
@augments ScreenWaitData

@param {string} [className] CSS class
@param {string} [message="Downloading data"] Message to be displayed.
@param {string} [filename="TheFragebogen.csv"] Name of the file to be downloaded
 */
function ScreenWaitDataDownload(className, message, filename) {
    ScreenWaitData.call(this, className === "string" ? className : "", 300, typeof(message) === "string" ? message : "Downloading data");

    this.filename = (typeof(filename) === "string" ? filename : "TheFragebogen.csv");

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: filename as " + this.filename);
}

ScreenWaitDataDownload.prototype = Object.create(ScreenWaitData.prototype);
ScreenWaitDataDownload.prototype.constructor = ScreenWaitDataDownload;

ScreenWaitDataDownload.prototype.createUI = function() {
    this.node = document.createElement("div");

    var span = document.createElement("span");
    span.innerHTML = this.html;
    this.node.appendChild(span);

    return this.node;
};

/**
On start(), the screenController.requestDataCSV() is called with this.callbackDownload() as callback.
ScreenController needs to set the callback accordingly.
*/
ScreenWaitDataDownload.prototype.start = function() {
    this._sendGetDataCallback();
    this.callbackDownload(this.data);
};
/**
Callback to download data.
@param {string} data
*/
ScreenWaitDataDownload.prototype.callbackDownload = function(data) {
    TheFragebogen.logger.info(this.constructor.name + ".callbackDownload()", data);
    downloadData(this.filename, data);
    this._sendPaginateCallback();
};
