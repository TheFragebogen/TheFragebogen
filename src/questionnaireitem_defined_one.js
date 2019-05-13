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

            if (this.getAnswer() === this.optionList[i]) {
                this.input[i].checked = true;
            }

            this.input[i].addEventListener("change", (event) => this.setAnswer(this.optionList[event.target.value]));

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

    applyAnswerToUI() {
        if (!this.isUIcreated()) {
            return;
        }

        if (this.getAnswer() === null) {
            this.input.map((input) => input.checked = false);
            return;
        }

        const selectedOption = this.optionList.indexOf(this.getAnswer());
        if (selectedOption === -1) {
            TheFragebogen.logger.warn(this.constructor.name, "applyAnswerToUI(): option unknown; cannot restore to UI. " + this.getAnswer());
            return;
        }

        this.input[optionList].checked = true;
    }

    releaseUI() {
        super.releaseUI();

        this.identifier = null;
    }
}
