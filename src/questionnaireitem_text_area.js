/**
A QuestionnaireItem for text input.
This item uses a HTML textarea.

@class QuestionnaireItemTextArea
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem

@param {string} [className] CSS class
@param {string} question
@param {boolean} [required=false]

@param {number} [rows=2] The number of rows.
@param {number} [cols=19] The number of colums.
@param {string} [placeholder=""] The placeholder text to show.
*/
function QuestionnaireItemTextArea(className, question, required, rows, cols, placeholder) {
    QuestionnaireItem.call(this, className, question, required);

    this.rows = !isNaN(rows) && rows > 0 ? rows : 2;
    this.cols = !isNaN(cols) && cols > 0 ? cols : 19;
    this.placeholder = typeof(placeholder) === "string" ? placeholder : "";

    this.textarea = null;
    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: rows as " + this.rows + ", cols as " + this.cols + " and placeholder as " + this.placeholder);
}
QuestionnaireItemTextArea.prototype = Object.create(QuestionnaireItem.prototype);
QuestionnaireItemTextArea.prototype.constructor = QuestionnaireItemTextArea;

QuestionnaireItemTextArea.prototype._createAnswerNode = function() {
    var node = document.createElement("div");

    this.textarea = document.createElement("textarea");
    this.textarea.rows = this.rows;
    this.textarea.cols = this.cols;
    this.textarea.placeholder = this.placeholder;
    this.textarea.addEventListener("change", this._handleChange.bind(this));

    node.appendChild(this.textarea);

    this._applyAnswerToUI();
    return node;
};
QuestionnaireItemTextArea.prototype._handleChange = function(event) {
    if (this.textarea.value === "") {
        this.setAnswer(null);
    } else {
        this.setAnswer(this.textarea.value);
    }

    TheFragebogen.logger.info("QuestionnaireItemTextArea._handleChange()", this.getAnswer() + ".");
};

QuestionnaireItemTextArea.prototype._applyAnswerToUI = function() {
    if (!this.isUIcreated()) {
        return;
    }

    if (this.isAnswered()) {
        this.textarea.value = this.getAnswer();
    }
};

/**
@param {string} answer
@returns {boolean}
*/
QuestionnaireItemTextArea.prototype.setAnswer = function(answer) {
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

QuestionnaireItemTextArea.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.textarea = null;
};

QuestionnaireItemTextArea.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};

QuestionnaireItemTextArea.prototype._checkData = function(data) {
    return (data[0] === this.question);
};

QuestionnaireItemTextArea.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[1]);
    return true;
};
