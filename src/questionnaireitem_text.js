/**
A QuestionnaireItem for one line text input.
This item uses a HTML input field.

@class QuestionnaireItemText
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem

@param {string} [className] CSS class
@param {string} question
@param {boolean} [required=false]
*/
function QuestionnaireItemText(className, question, required) {
    QuestionnaireItem.call(this, className, question, required);

    this.input = null;
}
QuestionnaireItemText.prototype = Object.create(QuestionnaireItem.prototype);
QuestionnaireItemText.prototype.constructor = QuestionnaireItemText;

QuestionnaireItemText.prototype._createAnswerNode = function() {
    var node = document.createElement("div");

    this.input = document.createElement("input");
    this.input.addEventListener("change", this._handleChange.bind(this));

    this.node.appendChild(this.input);

    this._applyAnswerToUI();
    return node;
};

QuestionnaireItemText.prototype._handleChange = function(event) {
    if (this.input.value === "") {
        this.setAnswer(null);
    } else {
        this.setAnswer(this.input.value);
    }

    TheFragebogen.logger.info(this.constructor.name + "._handleChange()", this.getAnswer() + ".");
};

QuestionnaireItemText.prototype._applyAnswerToUI = function() {
    if (!this.isUIcreated()) {
        return;
    }

    if (this.isAnswered()) {
        this.input.value = this.getAnswer();
    }
};
/**
@param {string} answer answer
@returns {boolean}
*/
QuestionnaireItemText.prototype.setAnswer = function(answer) {
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

QuestionnaireItemText.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.input = null;
};

QuestionnaireItemText.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};

QuestionnaireItemText.prototype._checkData = function(data) {
    return (data[0] === this.question);
};

QuestionnaireItemText.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[1]);
    return true;
};
