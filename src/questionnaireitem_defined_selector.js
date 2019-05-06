/**
A QuestionnaireItem that has a predefined set of answer and one of these can be selected.
A HTML select-element is used.

@class QuestionnaireItemDefinedSelector
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemDefined
*/
class QuestionnaireItemDefinedSelector extends QuestionnaireItemDefined {

    /**
    @param {string} [className] CSS class
    @param {string} question question
    @param {boolean} [required=false]
    @param {array} optionList
    */
    constructor(className, question, required, optionList) {
    super(className, question, required, optionList);
}

_createAnswerNode() {
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
}

_handleChange(event) {
    this.answer = this.select.value === "" ? null : this.select.value;
    this._sendReadyStateChanged();
}

_applyAnswerToUI() {
    if (!this.isUIcreated()) {
        return;
    }

    if (this.isAnswered()) {
        this.select.value = this.getAnswer();
    }
}

setAnswer(answer) {
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
}

releaseUI() {
    super.releaseUI();

    this.input = [];
    this.select = null;
}

getData() {
    return [this.getQuestion(), this.optionList, this.getAnswer()];
}

_checkData(data) {
    return (data[0] === this.question) && (JSON.stringify(data[1]) === JSON.stringify(this.optionList));
}

setData(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[2]);
    return true;
}
}
