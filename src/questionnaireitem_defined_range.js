/**
A QuestionnaireItem that can be used to input number ranges.
Uses the HTML input type="range".

@class QuestionnaireItemDefinedRange

@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemDefined

@param {string} [className] CSS class
@param {string} question
@param {boolean} [required=false]

@param {int} [min] Minimal acceptable answer.
@param {int} [max] Maximal acceptable answer.
*/
function QuestionnaireItemDefinedRange(className, question, required, min, max) {
    QuestionnaireItemDefined.call(this, className, question, required, [min, max]);

    this.min = min;
    this.max = max;

    this.input = null;
}
QuestionnaireItemDefinedRange.prototype = Object.create(QuestionnaireItemDefined.prototype);
QuestionnaireItemDefinedRange.prototype.constructor = QuestionnaireItemDefinedRange;

QuestionnaireItemDefinedRange.prototype._createAnswerNode = function() {
    var node = document.createElement("div");
    node.className = this.className;

    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.min = this.min;
    this.input.max = this.max;
    this.input.addEventListener("change", this._handleChange.bind(this));

    node.appendChild(this.input);

    this._applyAnswerToUI();
    return node;
};

QuestionnaireItemDefinedRange.prototype._handleChange = function(event) {
    this.answer = this.input.value;
};

QuestionnaireItemDefinedRange.prototype._applyAnswerToUI = function() {
    if (!this.isUIcreated()) {
        return;
    }

    if (this.isAnswered()) {
        this.input.value = this.getAnswer();
    }
};
/**
@param {string} answer
@returns {boolean}
*/
QuestionnaireItemDefinedRange.prototype.setAnswer = function(answer) {
    if (answer === null) {
        this.answer = null;
        this._applyAnswerToUI();
        return true;
    }

    this.answer = answer;
    this._applyAnswerToUI();
    this._sendReadyStateChanged();
    return true;
};

QuestionnaireItemDefinedRange.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.input = null;
};

QuestionnaireItemDefinedRange.prototype.getData = function() {
    return [this.getQuestion(), [this.min, this.max], this.getAnswer()];
};

QuestionnaireItemDefinedRange.prototype._checkData = function(data) {
    return (data[0] === this.question) && (data[1][0] === this.min) && (data[1][1] === this.max);
};

QuestionnaireItemDefinedRange.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[2]);
    return true;
};
