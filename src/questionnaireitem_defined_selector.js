/**
A QuestionnaireItem that has a predefined set of answer and one of these can be selected.
A HTML select-element is used.

@class QuestionnaireItemDefinedSelector

@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemDefined

@param {string} [className] CSS class
@param {string} question question
@param {boolean} [required=false]
@param {array} optionList
*/
function QuestionnaireItemDefinedSelector(className, question, required, optionList) {
    QuestionnaireItemDefined.call(this, className, question, required, optionList);
}
QuestionnaireItemDefinedSelector.prototype = Object.create(QuestionnaireItemDefined.prototype);
QuestionnaireItemDefinedSelector.prototype.constructor = QuestionnaireItemDefinedSelector;

QuestionnaireItemDefinedSelector.prototype._createAnswerNode = function() {
    var node = document.createElement("div");

    this.select = document.createElement("select");
    this.select.addEventListener("change", this._handleChange.bind(this));

    var optionNull = document.createElement("option");
    optionNull.value = "";
    optionNull.disabled = true;
    optionNull.selected = true;
    optionNull.innerHTML = "";
    this.select.appendChild(optionNull);

    for (var i in this.optionList) {
        var option = document.createElement("option");
        option.value = this.optionList[i];
        option.innerHTML = this.optionList[i];
        this.select.appendChild(option);
    }

    node.appendChild(this.select);

    this._applyAnswerToUI();
    return node;
};
QuestionnaireItemDefinedSelector.prototype._handleChange = function(event) {
    this.answer = this.select.value;
};

QuestionnaireItemDefinedSelector.prototype._applyAnswerToUI = function() {
    if (!this.isUIcreated()) {
        return;
    }

    if (this.isAnswered()) {
        this.select.value = this.getAnswer();
    }
};

QuestionnaireItemDefinedSelector.prototype.setAnswer = function(answer) {
    if (answer === null) {
        this.answer = null;
        this._applyAnswerToUI();
        return true;
    }

    var answerIndex = this.optionList.indexOf(answer);
    if (answerIndex === -1) {
        TheFragebogen.logger.error(this.constructor.name + ".setAnswer()", "Provided answer is not an option " + answer + ".");
        return false;
    }

    this.answer = this.optionList[answerIndex];
    this._applyAnswerToUI();

    this._sendReadyStateChanged();
    return true;
};

QuestionnaireItemDefinedSelector.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.input = [];
    this.select = null;
};

QuestionnaireItemDefinedSelector.prototype.getData = function() {
    return [this.getQuestion(), this.optionList, this.getAnswer()];
};

QuestionnaireItemDefinedSelector.prototype._checkData = function(data) {
    return (data[0] === this.question) && (JSON.stringify(data[1]) === JSON.stringify(this.optionList));
};

QuestionnaireItemDefinedSelector.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[2]);
    return true;
};
