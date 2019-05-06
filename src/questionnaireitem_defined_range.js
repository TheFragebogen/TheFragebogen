/**
A QuestionnaireItem that can be used to input number ranges.
Uses the HTML input type="range".

@class QuestionnaireItemDefinedRange
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemDefined
*/
class QuestionnaireItemDefinedRange extends QuestionnaireItemDefined {

    /**
    @param {string} [className] CSS class
    @param {string} question
    @param {boolean} [required=false]
    @param {int} [min] Minimal acceptable answer.
    @param {int} [max] Maximal acceptable answer.
    */
    constructor(className, question, required, min, max) {
    super(className, question, required, [min, max]);

    this.min = min;
    this.max = max;

    this.input = null;
}

_createAnswerNode() {
    const answerNode = document.createElement("div");
    answerNode.className = this.className;

    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.min = this.min;
    this.input.max = this.max;
    this.input.addEventListener("change", this._handleChange.bind(this));

    answerNode.appendChild(this.input);

    this._applyAnswerToUI();
    return answerNode;
}

_handleChange(event) {
    this.answer = this.input.value;
    this._sendReadyStateChanged();
}

_applyAnswerToUI() {
    if (!this.isUIcreated()) {
        return;
    }

    if (this.isAnswered()) {
        this.input.value = this.getAnswer();
    }
}

/**
@param {string} answer
@returns {boolean}
*/
setAnswer(answer) {
    if (answer === null) {
        this.answer = null;
        this._applyAnswerToUI();
        return true;
    }

    this.answer = answer;
    this._applyAnswerToUI();
    this._sendReadyStateChanged();
    return true;
}

releaseUI() {
    super.releaseUI();

    this.input = null;
}

getData() {
    return [this.getQuestion(), [this.min, this.max], this.getAnswer()];
}

_checkData(data) {
    return (data[0] === this.question) && (data[1][0] === this.min) && (data[1][1] === this.max);
}

setData(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[2]);
    return true;
}
}
