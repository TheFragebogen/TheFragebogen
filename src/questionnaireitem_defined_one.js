/**
QuestionnaireItems that have a predefined set of answer and one of these can be selected.
A group of radiobuttons is used.

@class QuestionnaireItemDefinedOne
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemDefined

@param {string} [className] CSS class
@param {string} questions
@param {boolean} [required=false]
@param {array} optionList
*/
function QuestionnaireItemDefinedOne(className, question, required, optionList) {
    QuestionnaireItemDefined.call(this, className, question, required, optionList);

    this.identifier = Math.random(); //Part of the identifier for the label + radiobutton relation.
}
QuestionnaireItemDefinedOne.prototype = Object.create(QuestionnaireItemDefined.prototype);
QuestionnaireItemDefinedOne.prototype.constructor = QuestionnaireItemDefinedOne;

QuestionnaireItemDefinedOne.prototype._createAnswerNode = function() {
    var tableRowLabel = document.createElement('tr');
    var tableRowRadio = document.createElement('tr');

    for (var i = 0; i < this.optionList.length; i++) {
        this.input[i] = document.createElement("input");
        this.input[i].value = i;
        this.input[i].id = this.identifier + i;
        this.input[i].name = this.identifier;
        this.input[i].type = "radio";

        if (this.answer === this.optionList[i]) {
            this.input[i].checked = true;
        }

        this.input[i].addEventListener("change", this._handleChange.bind(this));

        var label = document.createElement("label");
        label.setAttribute("for", this.identifier + i);
        label.innerHTML = this.optionList[i];

        var tdLabel = document.createElement('td');
        tdLabel.appendChild(label);
        tableRowLabel.appendChild(tdLabel);

        var tdRadio = document.createElement('td');
        tdRadio.appendChild(this.input[i]);
        tableRowRadio.appendChild(tdRadio);
    }

    var tableBody = document.createElement('tbody');
    tableBody.appendChild(tableRowLabel);
    tableBody.appendChild(tableRowRadio);

    var table = document.createElement('table');
    table.style.display = "inline"; //CSS
    table.appendChild(tableBody);

    return table;
};

QuestionnaireItemDefinedOne.prototype._handleChange = function(event) {
    this.answer = this.optionList[event.target.value];
    this.markRequired();
    this._sendReadyStateChanged();
    TheFragebogen.logger.info(this.constructor.name + "._handleChange()", this.answer);
};

QuestionnaireItemDefinedOne.prototype._applyAnswerToUI = function() {
    if (!this.isUIcreated()) {
        return;
    }

    for (var i = 0; i < this.answer.length; i++) {
        if (this.input[i] !== undefined) {
            this.input[i].checked = this.answer[i] || false;
        }
    }
};
/**
@param {string} answer answer
@returns {boolean}
*/
QuestionnaireItemDefinedOne.prototype.setAnswer = function(answer) {
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

QuestionnaireItemDefinedOne.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.input = [];
    this.identifier = null;
};

QuestionnaireItemDefinedOne.prototype.getData = function() {
    return [this.getQuestion(), this.optionList, this.getAnswer()];
};

QuestionnaireItemDefinedOne.prototype._checkData = function(data) {
    return (data[0] === this.question) && (JSON.stringify(data[1]) === JSON.stringify(this.optionList));
};

QuestionnaireItemDefinedOne.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[2]);
    return true;
};
