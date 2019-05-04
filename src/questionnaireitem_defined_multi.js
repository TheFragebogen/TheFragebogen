/**
A QuestionnaireItem that has a predefined set of answer and multiple of these can be selected.
A group of checkboxes is used.

@class QuestionnaireItemDefinedMulti
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemDefined
*/
class QuestionnaireItemDefinedMulti extends QuestionnaireItemDefined {

    /**
    @param {string} [className] CSS class
    @param {string} question
    @param {boolean} [required=false]
    @param {array} optionList
    */
    constructor(className, question, required, optionList) {
    super(className, question, required, optionList);

    this.identifier = Math.random(); //Part of the identifier for the label + checkbox relation.
    this.answer = [];
}

_createAnswerNode() {
    var node = document.createElement("div");

    for (var i = 0; i < this.optionList.length; i++) {
        this.input[i] = document.createElement("input");
        this.input[i].type = "checkbox";
        this.input[i].id = this.identifier + i;
        this.input[i].name = this.identifier;
        this.input[i].value = i;

        this.input[i].addEventListener("change", this._handleChange.bind(this));

        var label = document.createElement("label");
        label.setAttribute("for", this.identifier + i);
        label.innerHTML = this.optionList[i];

        node.appendChild(this.input[i]);
        node.appendChild(label);
    }

    this._applyAnswerToUI();
    return node;
}

_handleChange(event) {
    this.answer[event.target.value] = event.target.checked;
    this.markRequired();
    this._sendReadyStateChanged();
    TheFragebogen.logger.info(this.constructor.name + "._handleChange()", this.getAnswer() + ".");
}

_applyAnswerToUI() {
    if (!this.isUIcreated()) {
        return;
    }

    for (var i = 0; i < this.answer.length; i++) {
        if (this.input[i] !== undefined) {
            this.input[i].checked = this.answer[i] || false;
        }
    }
}

getAnswer() {
    //Clone answer
    var result = this.optionList.slice(0);

    //Remove not selected items
    for (var i = 0; i < this.optionList.length; i++) {
        if (!this.answer[i]) {
            result[i] = null;
        }
    }

    return result.filter(function(n) {
        return n !== null;
    });
}

/**
@param {(string|string[])} answer
@returns {boolean}
*/
setAnswer(answer) {
    if (answer === null) {
        this.answer = [];
        this._applyAnswerToUI();
        return true;
    }

    if (typeof(answer) === "string") {
        answer = [answer];
    }

    if (answer instanceof Array) {
        this.answer = [];

        if (answer.length > this.optionList.length) {
            TheFragebogen.logger.warn(this.constructor.name + ".setAnswer()", "use only an array.");
            return false;
        }

        for (var i = 0; i < answer.length; i++) {
            var optionIndex = this.optionList.indexOf(answer[i]);
            if (optionIndex === -1) {
                TheFragebogen.logger.warn(this.constructor.name + ".setAnswer()", "Option " + answer[i] + " is not available in " + this.optionList + ".");
                this.answer = [];
                return false;
            }
            this.answer[optionIndex] = true;
        }
        this._applyAnswerToUI();
        this._sendReadyStateChanged();
        return true;
    }

    TheFragebogen.logger.warn(this.constructor.name + ".setAnswer()", "Only accepts: string or array[string].");
    return false;
}

isAnswered() {
    return this.answer.length > 0;
}

releaseUI() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.input = [];
    this.identifier = null;
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
