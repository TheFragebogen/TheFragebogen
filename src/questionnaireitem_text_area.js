/**
A QuestionnaireItem for text input.
This item uses a HTML textarea.

@class QuestionnaireItemTextArea
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemTextArea extends QuestionnaireItem {

    /**
    @param {string} [className] CSS class
    @param {string} question
    @param {boolean} [required=false]

    @param {number} [rows=2] The number of rows.
    @param {number} [cols=19] The number of colums.
    @param {string} [placeholder=""] The placeholder text to show.
    */
    constructor(className, question, required, rows, cols, placeholder) {
        super(className, question, required);

        this.rows = !isNaN(rows) && rows > 0 ? rows : 2;
        this.cols = !isNaN(cols) && cols > 0 ? cols : 19;
        this.placeholder = typeof(placeholder) === "string" ? placeholder : "";

        this.textarea = null;
        TheFragebogen.logger.debug(this.constructor.name + "()", "Set: rows as " + this.rows + ", cols as " + this.cols + " and placeholder as " + this.placeholder);
    }

    _createAnswerNode() {
        const answerNode = document.createElement("div");

        this.textarea = document.createElement("textarea");
        this.textarea.rows = this.rows;
        this.textarea.cols = this.cols;
        this.textarea.placeholder = this.placeholder;
        this.textarea.addEventListener("change", () => this.setAnswer(this.textarea.value === "" ? null : this.textarea.value));

        answerNode.appendChild(this.textarea);

        return answerNode;
    }

    applyAnswerToUI() {
        if (!this.isUIcreated()) {
            return;
        }

        if (this.isAnswered()) {
            this.textarea.value = this.getAnswer();
        }
    }

    releaseUI() {
        super.releaseUI();

        this.textarea = null;
    }
}
