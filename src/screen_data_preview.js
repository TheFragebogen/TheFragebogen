/**
A screen that shows all data that is _currently_ stored by the ScreenController.

Reports nothing.

@class ScreenDataPreview
@augments Screen

@param {string} [className] CSS class
*/
function ScreenDataPreview(className) {
    Screen.call(this);

    this.data = null;
    this.className = className;

    this.getDataFromScreencontroller = null;

    this.node = null;
}

ScreenDataPreview.prototype = Object.create(Screen.prototype);
ScreenDataPreview.prototype.constructor = ScreenDataPreview;

ScreenDataPreview.prototype.createUI = function() {
    //Request data
    if (this.getDataFromScreencontroller instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + "._sendGetDataFromScreencontroller()", "called");
        this.data = this.getDataFromScreencontroller();
    }

    this.node = document.createElement("div");
    this.node.innerHTML = "<h1>Data Preview</h1>";
    this.node.className = this.className;

    var tblBody = document.createElement("tbody");
    for (i = 0; i < this.data.length; i++) {
        var row = document.createElement("tr");
        for (j = 0; j < this.data[i].length; j++) {

            var cell = document.createElement(i == 0 ? "th" : "td");

            cell.innerHTML = this.data[i][j];
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }

    var tbl = document.createElement("table");
    tbl.appendChild(tblBody);
    this.node.appendChild(tbl);

    var button = document.createElement("input");
    button.type = "button";
    button.value = "Next";
    button.onclick = (this._sendReadyStateChangedCallback).bind(this);

    this.node.appendChild(button);

    return this.node;
};

ScreenDataPreview.prototype.releaseUI = function() {
    this.node = null;
    this.data = null;
};
/**
Set the function pointer for requesting the ScreenController's _raw_ data.
@param {function} function
@returns {boolean} true if parameter was a function
*/
ScreenDataPreview.prototype.setGetRawDataCallback = function(getDataFromScreencontroller) {
    if (getDataFromScreencontroller instanceof Function) {
        TheFragebogen.logger.debug(this.constructor.name + ".setGetRawDataCallback()", "called");
        this.getDataFromScreencontroller = getDataFromScreencontroller;
        return true;
    }
    return false;
};
