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
        const answerNode = document.createElement("div");

        this.input = document.createElement("input");
        this.input.addEventListener("change", (event) => this.setAnswer(this.input.value === "" ? null : this.input.value));

        answerNode.appendChild(this.input);

        return answerNode;
    }

    applyAnswerToUI() {
        if (!this.isUIcreated()) {
            return;
        }

        if (this.isAnswered()) {
            this.input.value = this.getAnswer();
        }
    }

    releaseUI() {
        super.releaseUI();

        this.input = null;
    }
}
