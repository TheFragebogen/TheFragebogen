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
        this.textarea.addEventListener("change", (event) => this._handleChange(event));

        answerNode.appendChild(this.textarea);

        this._applyAnswerToUI();
        return answerNode;
    }

    _handleChange(event) {
        if (this.textarea.value === "") {
            this.setAnswer(null);
        } else {
            this.setAnswer(this.textarea.value);
        }

        TheFragebogen.logger.info("QuestionnaireItemTextArea._handleChange()", this.getAnswer() + ".");
    }

    _applyAnswerToUI() {
        if (!this.isUIcreated()) {
            return;
        }

        if (this.isAnswered()) {
            this.textarea.value = this.getAnswer();
        }
    }

    /**
    @param {string} answer
    @returns {boolean}
    */
    setAnswer(answer) {
        if (answer === null) {
            this.answer = null;
            this._applyAnswerToUI();
            return true;
        }

        this.answer = answer;
        this._applyAnswerToUI();
        this._sendReadyStateChanged();
        return true;
    }

    releaseUI() {
        super.releaseUI();

        this.textarea = null;
    }
}
