/**
A QuestionnaireItem is an abstract UIElementInteractive that consists of a question and presents a scale.
The answer on the scale is stored.

NOTE: An QuestionnaireItem that is not yet answered but required, will be marked on check with the CSS class: `className + "Required"`.

DEVERLOPER: Subclasses need to override `_createAnswerNode()`.

@abstract
@class QuestionnaireItem
@augments UIElement
@augments UIElementInteractive

@param {string} [className] CSS class
@param {string} question question
@param {boolean} [required=false] Is this QuestionnaireItem required to be answered?
*/
function QuestionnaireItem(className, question, required) {
    UIElementInteractive.call(this);

    this.node = null;

    this.className = className;
    this.question = question;
    this.required = required;
    this.answer = null;

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: className as " + this.className + ", question as " + this.question + " and required as " + this.required);
}
QuestionnaireItem.prototype = Object.create(UIElementInteractive.prototype);
QuestionnaireItem.prototype.constructor = QuestionnaireItem;
/**
Returns the question.
@returns {string} The question.
*/
QuestionnaireItem.prototype.getQuestion = function() {
    return this.question;
};
/**
Returns the answer.
@returns {string} The answer.
*/
QuestionnaireItem.prototype.getAnswer = function() {
    return this.answer;
};
/**
Sets the answer.
DEVELOPER: If the answer is accepted, the method `this._sendReadyStateChanged()` must be called.
@abstract
*/
QuestionnaireItem.prototype.setAnswer = function() {
    this._sendReadyStateChanged();
    TheFragebogen.logger.debug(this.constructor.name + ".setAnswer()", "This method might need to be overridden.");
};
/**
Is this QuestionnaireItem answered?
@returns {boolean}
*/
QuestionnaireItem.prototype.isAnswered = function() {
    return this.answer !== null;
};
/**
Returns the list of predefined options.
@abstract
@returns {array} undefined by default.
*/
QuestionnaireItem.prototype.getAnswerOptions = function() {
    return undefined;
};
/**
Adjust the UI if the answer was changed using `setAnswer()`.
@abstract
*/
QuestionnaireItem.prototype._applyAnswerToUI = function() {
    TheFragebogen.logger.debug(this.constructor.name + "._applyAnswerToUI()", "This method might need to be overridden.");
};
QuestionnaireItem.prototype.setEnabled = function(enable) {
    this.enabled = this.isUIcreated() ? enable : false;

    if (this.node !== null) {
        var elements = this.node.getElementsByTagName("*");
        for (var i = 0; i < elements.length; i++) {
            elements[i].disabled = !this.enabled;
        }
    }
};
QuestionnaireItem.prototype.setVisible = function(visible) {
    this.node.style.visibility = visible ? "visible" : "hidden";
};
/**
Is this QuestionnaireItem ready, i.e., answered if required?
@returns {boolean}
*/
QuestionnaireItem.prototype.isReady = function() {
    return this.isRequired() ? this.isAnswered() : true;
};
/**
Is this QuestionnaireItem required to be answered?
@returns {boolean}
*/
QuestionnaireItem.prototype.isRequired = function() {
    return this.required;
};

QuestionnaireItem.prototype.createUI = function() {
    if (this.isUIcreated()) {
        return this.node;
    }

    this.enabled = false;
    this.uiCreated = true;

    this.node = document.createElement("div");
    this.node.className = this.className;

    this.node.appendChild(this._createQuestionNode());
    this.node.appendChild(this._createAnswerNode());

    return this.node;
};
/**
Create the UI showing the question.
@returns {HTMLElement} The div containing the question.
*/
QuestionnaireItem.prototype._createQuestionNode = function() {
    var node = document.createElement("div");
    node.innerHTML = this.question + (this.required ? "*" : "");
    return node;
};
/**
Create the UI showing the scale.
@abstract
@returns {HTMLElement} The HTML container with the scale.
*/
QuestionnaireItem.prototype._createAnswerNode = function() {
    TheFragebogen.logger.warn(this.constructor.name + "._createAnswerNode()", "This method might need to be overridden.");
};

QuestionnaireItem.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
};
/**
Mark this element as required if it was not answered (className + "Required").
Is called by the Screen if necessary.
*/
QuestionnaireItem.prototype.markRequired = function() {
    if (this.node === null) {
        return;
    }

    var classNameRequired = this.className + "Required";
    if (!this.isReady()) {
        this.node.classList.add(classNameRequired);
    } else {
        this.node.classList.remove(classNameRequired);
    }
};
