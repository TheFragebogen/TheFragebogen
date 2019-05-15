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
    }

    _createAnswerNode() {
        const answerNode = document.createElement("div");

        for (let i = 0; i < this.optionList.length; i++) {
            this.input[i] = document.createElement("input");
            this.input[i].type = "checkbox";
            this.input[i].id = this.identifier + i;
            this.input[i].name = this.identifier;
            this.input[i].value = this.optionList[i];

            this.input[i].addEventListener("change", (event) => this._handleChange(event));

            const label = document.createElement("label");
            label.setAttribute("for", this.identifier + i);
            label.innerHTML = this.optionList[i];

            answerNode.appendChild(this.input[i]);
            answerNode.appendChild(label);
        }

        return answerNode;
    }

    _handleChange(event) {
        let selectedOptions = this._getAnswer();
        const currentIndex = selectedOptions.indexOf(event.target.value);

        if (event.target.checked && currentIndex === -1) {
            selectedOptions.push(event.target.value);
        }
        if (!event.target.checked) {
            selectedOptions.splice(currentIndex, 1);
        }

        this.setAnswer(selectedOptions.sort());
    }

    applyAnswerToUI() {
        if (!this.isUIcreated()) {
            return;
        }

        const selectedOptionList = this._getAnswer();
        for (let i = 0; i < this.input.length; i++) {
            this.input[i].checked = selectedOptionList.indexOf(this.optionList[i]) !== -1;
        }
    }

    getAnswer() {
        return super.getAnswer();
    }

    _getAnswer() {
        return this.getAnswer() || [];
    }

    isAnswered() {
        return this._getAnswer().length > 0;
    }

    releaseUI() {
        super.releaseUI();

        this.identifier = null;
    }
}
