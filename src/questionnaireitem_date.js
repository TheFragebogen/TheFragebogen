/**
A QuestionnaireItem with a HTML5 date selector.

@class QuestionnaireItemDate
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem

@param {string} [className] CSS class
@param {string} [question]
@param {boolean} [required=false]
@param {string} [min] The earliest acceptable date.
@param {string} [max] The lattest acceptable date.
@param {string} [pattern] The pattern an acceptable date needs to fulfill.
*/
function QuestionnaireItemDate(className, question, required, min, max, pattern) {
    QuestionnaireItem.call(this, className, question, required);

    this.min = min;
    this.max = max;
    this.pattern = pattern;

    this.input = null;

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: min as " + this.min + ", max as " + this.max + " and pattern as " + this.pattern);
}
QuestionnaireItemDate.prototype = Object.create(QuestionnaireItem.prototype);
QuestionnaireItemDate.prototype.constructor = QuestionnaireItemDate;

QuestionnaireItemDate.prototype._createAnswerNode = function() {
    var node = document.createElement("div");

    this.input = document.createElement("input");
    this.input.setAttribute("type", "date");
    if (this.input.type !== "date") {
        node.innerHTML = "The HTML5 date feature not available in this browser.";
        TheFragebogen.logger.error(this.constructor.name + "._createAnswerNode()", "The HTML5 date feature not available in this browser.");
        return node;
    }
    this.input.min = this.min;
    this.input.max = this.max;
    this.input.pattern = this.pattern;
    this.input.addEventListener("change", this._handleChange.bind(this));

    node.appendChild(this.input);

    this._applyAnswerToUI();
    return node;
};

QuestionnaireItemDate.prototype._handleChange = function(event) {
    this.answer = this.input.value;
    this._sendReadyStateChanged();
};

QuestionnaireItemDate.prototype._applyAnswerToUI = function() {
    if (!this.isUIcreated()) {
        return;
    }

    if (this.isAnswered()) {
        this.input.value = this.getAnswer();
    }
};

QuestionnaireItemDate.prototype.setAnswer = function(answer) {
    this.answer = answer;
    this._applyAnswerToUI();
    this._sendReadyStateChanged();
    return true;
};

QuestionnaireItemDate.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.input = null;
};

QuestionnaireItemDate.prototype.getData = function() {
    return [this.getQuestion(), this.pattern, this.getAnswer()];
};

QuestionnaireItemDate.prototype._checkData = function(data) {
    return (data[0] === this.question) && (data[1] === this.pattern);
};

QuestionnaireItemDate.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[2]);
    return true;
};
