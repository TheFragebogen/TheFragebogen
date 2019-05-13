/**
A QuestionnaireItem with a HTML5 date selector.

@class QuestionnaireItemDate
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemDate extends QuestionnaireItem {

    /**
    @param {string} [className] CSS class
    @param {string} [question]
    @param {boolean} [required=false]
    @param {string} [min] The earliest acceptable date.
    @param {string} [max] The lattest acceptable date.
    @param {string} [pattern] The pattern an acceptable date needs to fulfill.
    */
    constructor(className, question, required, min, max, pattern) {
        super(className, question, required);

        this.min = min;
        this.max = max;
        this.pattern = pattern;

        this.input = null;

        TheFragebogen.logger.debug(this.constructor.name + "()", "Set: min as " + this.min + ", max as " + this.max + " and pattern as " + this.pattern);
    }

    _createAnswerNode() {
        const answerNode = document.createElement("div");

        this.input = document.createElement("input");
        this.input.setAttribute("type", "date");
        if (this.input.type !== "date") {
            answerNode.innerHTML = "The HTML5 date feature not available in this browser.";
            TheFragebogen.logger.error(this.constructor.name + "._createAnswerNode()", "The HTML5 date feature not available in this browser.");
            return node;
        }
        this.input.min = this.min;
        this.input.max = this.max;
        this.input.pattern = this.pattern;
        this.input.addEventListener("change", () => this.setAnswer(this.input.value === "" ? null : this.input.value));

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
