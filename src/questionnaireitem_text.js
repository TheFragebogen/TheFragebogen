/**
A QuestionnaireItem for one line text input.
This item uses a HTML input field.

@class QuestionnaireItemText
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemText extends QuestionnaireItem {

    /**
    @param {string} [className] CSS class
    @param {string} question
    @param {boolean} [required=false]
    */
    constructor(className, question, required) {
    super(className, question, required);

    this.input = null;
}

_createAnswerNode() {
    var answerNode = document.createElement("div");

    this.input = document.createElement("input");
    this.input.addEventListener("change", this._handleChange.bind(this));

    answerNode.appendChild(this.input);

    this._applyAnswerToUI();
    return answerNode;
}

_handleChange(event) {
    if (this.input.value === "") {
        this.setAnswer(null);
    } else {
        this.setAnswer(this.input.value);
    }

    TheFragebogen.logger.info(this.constructor.name + "._handleChange()", this.getAnswer() + ".");
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
@param {string} answer answer
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
    return [this.getQuestion(), this.getAnswer()];
}

_checkData(data) {
    return (data[0] === this.question);
}

setData(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[1]);
    return true;
}
}
