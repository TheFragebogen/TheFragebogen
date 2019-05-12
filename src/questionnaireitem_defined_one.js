/**
QuestionnaireItems that have a predefined set of answer and one of these can be selected.
A group of radiobuttons is used.

@class QuestionnaireItemDefinedOne
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemDefined
*/
class QuestionnaireItemDefinedOne extends QuestionnaireItemDefined {

    /**
    @param {string} [className] CSS class
    @param {string} questions
    @param {boolean} [required=false]
    @param {array} optionList
    */
    constructor(className, question, required, optionList) {
        super(className, question, required, optionList);

        this.identifier = Math.random(); //Part of the identifier for the label + radiobutton relation.
    }

    _createAnswerNode() {
        const tableRowLabel = document.createElement('tr');
        const tableRowRadio = document.createElement('tr');

        for (let i = 0; i < this.optionList.length; i++) {
            this.input[i] = document.createElement("input");
            this.input[i].value = i;
            this.input[i].id = this.identifier + i;
            this.input[i].name = this.identifier;
            this.input[i].type = "radio";

            if (this.answer === this.optionList[i]) {
                this.input[i].checked = true;
            }

            this.input[i].addEventListener("change", (event) => this._handleChange(event));

            const label = document.createElement("label");
            label.setAttribute("for", this.identifier + i);
            label.innerHTML = this.optionList[i];

            const tdLabel = document.createElement('td');
            tdLabel.appendChild(label);
            tableRowLabel.appendChild(tdLabel);

            const tdRadio = document.createElement('td');
            tdRadio.appendChild(this.input[i]);
            tableRowRadio.appendChild(tdRadio);
        }

        const tableBody = document.createElement('tbody');
        tableBody.appendChild(tableRowLabel);
        tableBody.appendChild(tableRowRadio);

        const table = document.createElement('table');
        table.style.display = "inline"; //CSS
        table.appendChild(tableBody);

        return table;
    }

    _handleChange(event) {
        this.answer = this.optionList[event.target.value];
        this.markRequired();
        this._sendReadyStateChanged();
        TheFragebogen.logger.info(this.constructor.name + "._handleChange()", this.answer);
    }

    _applyAnswerToUI() {
        if (!this.isUIcreated()) {
            return;
        }

        for (let i = 0; i < this.answer.length; i++) {
            if (this.input[i] !== undefined) {
                this.input[i].checked = this.answer[i] || false;
            }
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

        const answerIndex = this.optionList.indexOf(answer);
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
