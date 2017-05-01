/**
A screen that presents one or more UIElements.
All UIElements are visible and enabled by default.
Ready is reported when all UIElements reported ready AND the user pressed the presented button.

DEVERLOPER: To inherit this class, `ScreenUIElements.apply(this, arguments)` MUST be used instead of `ScreenUIElements.call(this, arguments)`.

Supports _pagination_.
Default paginator is `PaginateUIButton`.

@class ScreenUIElements
@augments Screen

@param {string} [className] CSS class
@param {array} arguments an array containing the UIElements of the screen
*/
function ScreenUIElements(className) {
    Screen.call(this);

    var localArguments = Array.prototype.slice.call(arguments);

    if (typeof(className) !== "string" || typeof(className) === "undefined" || className === null) {
        this.className = "";
    } else {
        this.className = className;
        localArguments.splice(0, 1);
    }

    for (var i in localArguments) {
        if (!(localArguments[i] instanceof UIElement)) {
            TheFragebogen.logger.error(this.constructor.name + "():", "This argument (index " + i + " is not an UIElement: " + localArguments[i]);
        }
    }
    this.uiElements = localArguments.filter(function(element) {
        return element instanceof UIElement;
    });

    if (this.uiElements.length < 1) {
        TheFragebogen.logger.error(this.constructor.name + "():", "No UIElements were passed to constructor.");
    }

    this.paginateUI = new PaginateUIButton();
}
ScreenUIElements.prototype = Object.create(Screen.prototype);
ScreenUIElements.prototype.constructor = ScreenUIElements;

ScreenUIElements.prototype.setPaginateUI = function(paginateUI) {
    if (this.isUIcreated()) return false;
    if (!(paginateUI instanceof PaginateUI || paginateUI === null)) return false;

    this.paginateUI = paginateUI;
    TheFragebogen.logger.debug(this.constructor.name + ".setPaginateUI()", "Set paginateUI.");
    return true;
};

ScreenUIElements.prototype.createUI = function() {
    this.node = document.createElement("div");
    this.node.className = this.className;

    for (var index in this.uiElements) {
        if (this.uiElements[index].createUI === undefined) {
            TheFragebogen.logger.warn(this.constructor.name + ".createUI():", "Element[" + index + "] has no 'createUI' method");
            continue;
        }

        var node = this.uiElements[index].createUI();
        if (node !== undefined && node !== null) {
            this.node.appendChild(node);
        }
    }

    if (this.paginateUI != null) {
        this.paginateUI.setPaginateCallback(this._sendReadyStateChangedCallback.bind(this));
        this.node.appendChild(this.paginateUI.createUI());
    }

    return this.node;
};

ScreenUIElements.prototype.releaseUI = function() {
    TheFragebogen.logger.info(this.constructor.name + ".release():", "");
    this.node = null;
    for (var index in this.uiElements) {
        this.uiElements[index].releaseUI();
    }
};
/**
Enables all the elements of the screen.
*/
ScreenUIElements.prototype.start = function() {
    TheFragebogen.logger.info(this.constructor.name + ".start()", "");

    for (var index in this.uiElements) {
        this.uiElements[index].setEnabled(true);
    }
};
/**
Are all UIElementInteractive ready?
@returns {boolean}
*/
ScreenUIElements.prototype.isReady = function() {
    var ready = true;

    for (var index in this.uiElements) {
        if (this.uiElements[index] instanceof UIElementInteractive) {
            if (!this.uiElements[index].isReady()) {
                ready = false;
            }
            this.uiElements[index].markRequired();
        }
    }
    return ready;
};
/**
 Returns the data of QuestionnaireItem (UIElementInteractive are omitted) in CSV format.
 The data of each questionnaire item is subdivided in 4 columns:
 1. QuestionnaireItem.getType()
 2. QuestionnaireItem.getQuestion()
 3. QuestionnaireItem.getAnswerOptions()
 4. QuestionnaireItem.getAnswer()
 @returns {array}
 */
ScreenUIElements.prototype.getDataCSV = function() {
    var data = [new Array(), new Array(), new Array(), new Array()];

    for (var index in this.uiElements) {
        if ((this.uiElements[index] instanceof QuestionnaireItem)) {
            data[0].push(this.uiElements[index].getType());
            data[1].push(this.uiElements[index].getQuestion());
            data[2].push(this.uiElements[index].getAnswerOptions());
            data[3].push(this.uiElements[index].getAnswer());
        }
    }
    return data;
};

ScreenUIElements.prototype.preload = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".preload()", "called");

    for (var i = 0; i < this.uiElements.length; i++) {
        this.uiElements[i].setOnPreloadedCallback(this._onUIElementPreloaded.bind(this));
        this.uiElements[i].preload();
    }
};

/**
All external resources loaded?
@abstract
@returns {boolean}
*/
ScreenUIElements.prototype.isPreloaded = function() {
    for (var i = 0; i < this.uiElements.length; i++) {
        if (!this.uiElements[i].isPreloaded()) return false;
    }
    return true;
};

ScreenUIElements.prototype._onUIElementPreloaded = function() {
    for (var i = 0; i < this.uiElements.length; i++) {
        if (!this.uiElements[i].isPreloaded()) return;
    }

    this._sendOnPreloadedCallback();
};
