/**
A ScreenController coordinates a questionnaire, i.e., showing a set of Screens and storing the gathered data.
This ScreenController shows the Screens in a predefined order.
Applies lifecycle management for the Screens.

ATTENTION: `ScreenController.init(parentNode)` must be called before using a ScreenController.

@class ScreenController

@param {array} The Screens to be used.

Callbacks:
* ScreenController.callbackScreenFinished() {boolean}: The current screen is done; continue to next screen?

*/
function ScreenController() {
    if (arguments.length === 0) TheFragebogen.logger.fatal(this.constructor.name + ".constructor", "No screen available.");

    var localArguments = [].concat.apply([], arguments); //Flatten the potential array.
    for (var i in localArguments) {
        if (!(localArguments[i] instanceof Screen)) TheFragebogen.logger.error(this.constructor.name + "():", "This argument (index " + i + " is not a Screen: " + localArguments[i] + " and will be ignored.");
    }
    this.screen = localArguments.filter(function(element) {
        return element instanceof Screen;
    });

    this.callbackScreenFinished = null;

    this.currentScreenIndex = null;
    this.screenContainerNode = null;

    this.preloadedScreenResult = null;
}
ScreenController.prototype.constructor = ScreenController;
/**
Init this instance of ScreenController; most important providing the HTML element to be used.

@param {HTMLElement} [parentNode] The parent HTML element; must be a container.
*/
ScreenController.prototype.init = function(parentNode) {
    if (this.screenContainerNode !== null) {
        TheFragebogen.logger.warn(this.constructor.name + ".init()", "Is already initialized.");
        return;
    }

    TheFragebogen.logger.debug(this.constructor.name + ".init()", "Start");

    this.screenContainerNode = parentNode;

    for (i = 0; i < this.screen.length; i++) {
        if (this.screen[i].setGetDataCallback instanceof Function) {
            this.screen[i].setGetDataCallback((this.requestDataCSV).bind(this));
        }
        if (this.screen[i].setGetRawDataCallback instanceof Function) {
            this.screen[i].setGetRawDataCallback((this.requestDataArray).bind(this));
        }
        if (this.screen[i].setPaginateCallback instanceof Function) {
            this.screen[i].setPaginateCallback((this.nextScreen).bind(this));
        }
    }

    this.currentScreenIndex = 0;
};
ScreenController.prototype.setCallbackScreenFinished = function(callback) {
    if (!(callback instanceof Function)) {
        TheFragebogen.logger.warn(this.constructor.name + ".setCallbackScreenFinished()", "Callback is not a function. Ignoring it.");
        return;
    }
    this.callbackScreenFinished = callback;
};
/**
Add an additional screen at the end.Appends a screen and returns the index.

@param {Screen} screen
@returns {number} The index of the just added screen; in case of failure -1.
*/
ScreenController.prototype.addScreen = function(screen) {
    if (!(screen instanceof Screen)) {
        TheFragebogen.logger.warn(this.constructor.name + ".addScreen()", "This screen is not a screen. Ignoring it.");
        return -1;
    }

    TheFragebogen.logger.info(this.constructor.name + ".addScreen()", "Appending screen.");
    this.screen.push(screen);

    if (screen.setGetDataCallback instanceof Function) {
        screen.setGetDataCallback((this.requestDataCSV).bind(this));
    }
    if (screen.setGetRawDataCallback instanceof Function) {
        screen.setGetRawDataCallback((this.requestDataArray).bind(this));
    }
    if (screen.setPaginateCallback instanceof Function) {
        screen.setPaginateCallback((this.nextScreen).bind(this));
    }

    return this.screen.length - 1;
};
/**
Starts the screenController, i.e., showing the screen in their respective order.
*/
ScreenController.prototype.start = function() {
    this.screenContainerNode.innerHTML = "";
    this._displayUI();
};
/**
Proceeds to the next screen if the current screen reports ready.

@param {Screen} screen The screen that send the callback.
@param {number} [relativeScreenId=1]
*/
ScreenController.prototype.nextScreen = function(screen, relativeScreenId) {
    if (this.screenContainerNode === null) {
        TheFragebogen.logger.error(this.constructor.name + ".nextScreen()", "Please call init() before.");
        return;
    }

    if (!(screen instanceof Screen)) {
        TheFragebogen.logger.error(this.constructor.name + ".nextScreen()", "Got a callback without a screen.");
        return;
    }

    if (screen !== this.screen[this.currentScreenIndex]) {
        TheFragebogen.logger.error(this.constructor.name + ".nextScreen()", "Got a callback from a different screen than the current one.");
        return;
    }

    if (this.callbackScreenFinished instanceof Function && !this.callbackScreenFinished(relativeScreenId)) { //Should we proceed to the next screen or is this handled by external command?
        return;
    }

    relativeScreenId = relativeScreenId === undefined ? 1 : relativeScreenId;
    this.goToScreenRelative(relativeScreenId);
};
ScreenController.prototype._displayUI = function() {
    if (this.currentScreenIndex >= this.screen.length) {
        TheFragebogen.logger.error(this.constructor.name + "._displayUI()", "There is no screen with index " + this.currentScreenIndex + ".");
        return;
    }

    TheFragebogen.logger.info(this.constructor.name + "._displayUI()", "Displaying next screen with index: " + this.currentScreenIndex + ".");

    //Scroll back to top
    window.scrollTo(0, document.body.scrollLeft);

    //Add the new screen
    var screen = this.screen[this.currentScreenIndex];
    this.screenContainerNode.appendChild(screen.createUI());
    screen.start();
};
/**
Prepare data for export (CSV).
* Column 1: ScreenIndex
* Column 2: Class
* Column 3: Questions
* Column 4: Answer options
* Column 5: Answers

@return {string}
*/
ScreenController.prototype.requestDataCSV = function() {
    TheFragebogen.logger.info(this.constructor.name + ".requestDataCSV()", "called.");
    var dataArray = this.requestDataArray();

    var result = "";
    for (var i = 0; i < dataArray.length; i++) {
        result += '"' + dataArray[i][0]; //Screen index
        result += '","' + dataArray[i][1]; //Type of question
        result += '","' + dataArray[i][2]; //Question
        result += '","' + dataArray[i][3]; //Answer options
        result += '","' + dataArray[i][4] + '"\n'; //Answer
    }
    return result;
};
/**
Prepare data for export as a two-dimensional array:
* Column 1: ScreenIndex
* Column 2: Class
* Column 3: Questions
* Column 4: Answer options
* Column 5: Answers

@return {array}
*/
ScreenController.prototype.requestDataArray = function() {
    TheFragebogen.logger.info(this.constructor.name + ".requestDataArray()", "called.");

    var screenIndeces = ["Screen index"];
    var questionType = ["Type of item"];
    var questions = ["Question"];
    var options = ["Answer options"];
    var answers = ["Answer"];

    for (let i = 0; i <= this.currentScreenIndex; i++) {
        var currentData = this.screen[i].getDataCSV();

        if (currentData instanceof Array && currentData[0] instanceof Array && currentData[1] instanceof Array && currentData[2] instanceof Array && currentData[3] instanceof Array) {
            if (currentData[0].length === 0) continue;

            if (currentData[1].length > currentData[3].length) {
                TheFragebogen.logger.warn(this.constructor.name + ".requestDataArray()", "More items than answers - filling with null.");
                currentData[1][currentData[0].length] = null;
            }

            for (var j = 0; j < currentData[0].length; j++) {
                screenIndeces = screenIndeces.concat(i);
            }

            questionType = questionType.concat(currentData[0]);
            questions = questions.concat(currentData[1]);
            options = options.concat(currentData[2]);
            answers = answers.concat(currentData[3]);
        }
    }

    var result = [];
    for (let i in screenIndeces) {
        result[i] = [];
        result[i][0] = screenIndeces[i];
        result[i][1] = questionType[i];
        result[i][2] = questions[i];
        result[i][3] = options[i];
        result[i][4] = answers[i];
    }

    //Replace line breaks.
    result = result.map(function(line) {
        return line.map(function(cell) {
            return (typeof(cell) === "string") ? cell.replace(/\n/g, '\\n') : cell;
        });
    });
    return result;
};
/**
@return {boolean}
*/
ScreenController.prototype.isLastScreen = function() {
    return this.currentScreenIndex === this.screen.length - 1;
};
/*
@return {number}
*/
ScreenController.prototype.getCurrentScreenIndex = function() {
    return this.currentScreenIndex;
};
/*
@return {Screen}
*/
ScreenController.prototype.getCurrentScreen = function() {
    return this.screen[this.getCurrentScreenIndex()];
};
/**
Go to screen by screenId (relative).
@argument {number} relativeScreenId The screenId (relative) of the screen that should be displayed.
@return {boolean} Success.
*/
ScreenController.prototype.goToScreenRelative = function(relativeScreenId) {
    if (this.screenContainerNode === null) {
        TheFragebogen.logger.error(this.constructor.name + ".goToScreenRelative()", "Please call init() before.");
        return false;
    }

    var screenId = this.getCurrentScreenIndex() + relativeScreenId;

    if (!(0 <= screenId && screenId < this.screen.length)) {
        TheFragebogen.logger.error(this.constructor.name + ".goToScreenRelative()", "There is no screen with id: " + screenId);
        return false;
    }

    this.screen[this.currentScreenIndex].releaseUI();
    this.screenContainerNode.innerHTML = null;

    this.currentScreenIndex = screenId;
    this._displayUI();
    return true;
};
/**
Go to screen by screenId (absolute).
@argument {number} screenId The screenId (relative) of the screen that should be displayed.
@return {boolean} Success.
*/
ScreenController.prototype.goToScreenAbsolute = function(screenId) {
    return this.goToScreenRelative(screenId - this.getCurrentScreenIndex());
};
/**
Initiates preloading of external media, i.e., informs all `Screens` to start loading external media and report when ready/fail.
While preloading, `screenController.start()` can be called.

@see ScreenController._onPreloadedScreenFinished()
@see ScreenController._onScreenPreloaded()
@see ScreenController._finishedPreload()

@param innerHTML The HTML to be shown while preloading.
*/
ScreenController.prototype.preload = function(innerHTML) {
    TheFragebogen.logger.debug(this.constructor.name + ".preload()", "Preloading started.");

    this.screenContainerNode.innerHTML += innerHTML;

    for (var i = 0; i < this.screen.length; i++) {
        this.screen[i].setOnPreloadedCallback((this.onScreenPreloaded).bind(this));
        this.screen[i].preload();
    }
};

/**
Handles the returned preloadStatus from each screen.

@param {Screen} screen The screen that finished preloading.
*/
ScreenController.prototype.onScreenPreloaded = function() {
    for (var i = 0; i < this.screen.length; i++) {
        if (!this.screen[i].isPreloaded()) {
            return;
        }
    }

    this.onPreloadingDone();
};

/**
Preloading is finished.
Start the screenController.
*/
ScreenController.prototype.onPreloadingDone = function() {
    TheFragebogen.logger.info(this.constructor.name + "._onPreloadingDone()", "Preloading done. Let's go.");
    setTimeout(this.start.bind(this), 2000);
    //TODO Do something about preloading errors?
};
