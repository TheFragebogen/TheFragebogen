/**
A screen that uploads the currently stored data of the questionnaire in CSV format to a webserver via AJAX (HTTP POST).
A message is presented while uploading.
Default timeout: 4s.

USER: Be aware of Cross-site origin policy: http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
The web server must be configured accordingly if upload URL is different than the URL the questionnaire was loaded from.

@class ScreenWaitDataUpload

@augments Screen
@augments ScreenWait
@augments ScreenWaitData

@param {string} [className] CSS class
@param {string} [url]
@param {number} [timeout=4] timeout in seconds
@param {string} [message="Uploading data. Please wait..."]
@param {string} [httpParamaterName="data"]
@param {string} [failMessage="Upload failed. Data will be downloaded to local computer now."]
@param {boolean} [nextScreenOnFail=true] Continue to next screen if upload failed.
*/
function ScreenWaitDataUpload(className, url, timeout, message, httpParameterName, failMessage, nextScreenOnFail) {
    ScreenWaitData.call(this, className, !isNaN(timeout) ? Math.abs(timeout) : 4, typeof(message) === "string" ? message : "Uploading data. Please wait...");

    this.failMessage = (typeof(failMessage) === "string" ? failMessage : "Upload failed. Data will be downloaded to local computer now.");
    this.httpParameterName = (typeof(httpParameterName) === "string" ? httpParameterName : "data");
    this.nextScreenOnFail = (typeof(nextScreenOnFail) === "boolean") ? nextScreenOnFail : true;

    this.url = url;
    this.request = null;
    this.retryCount = 0;
    this.data = null;
    this.retry = 0;

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: httpParameterName as " + this.httpParameterName);
}

ScreenWaitDataUpload.prototype = Object.create(ScreenWaitData.prototype);
ScreenWaitDataUpload.prototype.constructor = ScreenWaitDataUpload;

ScreenWaitDataUpload.prototype.createUI = function() {
    this.node = document.createElement("div");

    var span = document.createElement("span");
    span.innerHTML = this.html;
    this.node.appendChild(span);

    return this.node;
};
/**
On start(), the screenController.requestDataCSV() is called with this.callbackUpload() as callback.
*/
ScreenWaitDataUpload.prototype.start = function() {
    this.retryCount = 0;

    this._sendGetDataCallback();
    this.callbackUpload(this.data);
};
/**
Callback to upload data.
@param {string} data
*/
ScreenWaitDataUpload.prototype.callbackUpload = function(data) {
    TheFragebogen.logger.info(this.constructor.name + ".callbackUpload()", "Starting upload to " + this.url);

    this.retry = null;
    this.retryCount++;
    this.data = data;

    this.request = new XMLHttpRequest();
    this.request.open("POST", this.url, true);
    this.request.timeout = this.time;

    this.request.ontimeout = (this._ontimeout).bind(this);
    this.request.onload = (this._onload).bind(this);
    this.request.onerror = (this._onerror).bind(this);

    this.request.send(this.httpParameterName + "=" + data);
};
/**
Callback if upload was successful; screen is then ready to continue.
*/
ScreenWaitDataUpload.prototype._onload = function() {
    if (this.request.readyState === 4 && this.request.status === 200) {
        TheFragebogen.logger.info(this.constructor.name + ".callbackUpload()", "Successful.");
        if (this.request.responseText !== "") {
            TheFragebogen.logger.info(this.constructor.name + "._onload()", this.request.responseText);
        }

        this._sendReadyStateChangedCallback();
    } else {
        TheFragebogen.logger.error(this.constructor.name + "._onload()", "Request to " + this.url + " failed with status code " + this.request.status);
        this.retryCount = 4;
        this._onerror();
    }

    this.request = null;
};
/**
Callback if upload failed and schedules a retry.
*/
ScreenWaitDataUpload.prototype._onerror = function() {
    var span = document.createElement("span");
    span.innerHTML = "" + "Upload failed. Retrying in 5 seconds.";
    this.node.appendChild(span);
    this.retry = setTimeout((this.callbackUpload).bind(this), 5000, this.data);

    TheFragebogen.logger.error(this.constructor.name + ".callbackUpload()", "Upload failed with HTTP code: " + this.request.status + ". Retrying in 5 seconds.");
};
/**
Callback if timeout.
*/
ScreenWaitDataUpload.prototype._ontimeout = function() {
    TheFragebogen.logger.error(this.constructor.name + ".callbackUpload()", "Upload got timeout after " + this.time + "ms.");
    this._onerror();
};
ScreenWaitDataUpload.prototype.releaseUI = function() {
    this.node = null;

    if (this.retry !== null) {
        clearTimeout(this.retry);
    }

    if (this.request instanceof XMLHttpRequest) {
        this.request.abort();
    }
    this.request = null;
};
