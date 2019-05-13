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

        this.input = document.createElement("input");
        this.input.type = "range";
        this.input.min = this.min;
        this.input.max = this.max;
        this.input.addEventListener("change", () => this.setAnswer(this.input.value));

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
