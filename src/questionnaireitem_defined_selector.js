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
        const answerNode = document.createElement("div");

        this.select = document.createElement("select");
        this.select.addEventListener("change", () => this.setAnswer(this.select.value === "" ? null : this.select.value));

        const optionNull = document.createElement("option");
        optionNull.value = "";
        optionNull.disabled = true;
        optionNull.selected = true;
        optionNull.innerHTML = "";
        this.select.appendChild(optionNull);

        for (let i = 0; i < this.optionList.length; i++) {
            const option = document.createElement("option");
            option.value = this.optionList[i];
            option.innerHTML = this.optionList[i];
            this.select.appendChild(option);
        }

        answerNode.appendChild(this.select);

        return answerNode;
    }

    applyAnswerToUI() {
        if (!this.isUIcreated()) {
            return;
        }

        if (this.isAnswered()) {
            this.select.value = this.getAnswer();
        }
    }

    releaseUI() {
        super.releaseUI();

        this.input = [];
        this.select = null;
    }
}
