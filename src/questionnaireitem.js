/**
A QuestionnaireItem is an abstract UIElementInteractive that consists of a question and presents a scale.
The answer on the scale is stored.

NOTE: An QuestionnaireItem that is not yet answered but required, will be marked on check with the CSS class: `className + "Required"`.

DEVERLOPER: Subclasses need to override `_createAnswerNode()`.

@abstract
@class QuestionnaireItem
@augments UIElement
@augments UIElementInteractive
*/
class QuestionnaireItem extends UIElementInteractive {

    /**
    @param {string} [className] CSS class
    @param {string} question question
    @param {boolean} [required=false] Is this QuestionnaireItem required to be answered?
    */
    constructor(className, question, required) {
        super(className);

        this.question = question;
        this.required = required;
        this.answer = null;

        TheFragebogen.logger.debug(this.constructor.name + "()", "Set: className as " + this.className + ", question as " + this.question + " and required as " + this.required);
    }

    /**
    Returns the question.
    @returns {string} The question.
    */
    getQuestion() {
        return this.question;
    }

    /**
    Returns the answer.
    @returns {string} The answer.
    */
    getAnswer() {
        return this.answer;
    }

    /**
    Sets the answer.
    DEVELOPER: If the answer is accepted, the method `this._sendReadyStateChanged()` must be called.
    @param {object} answer The answer to be set.
    @abstract
    */
    setAnswer(answer) {
        this._sendReadyStateChanged();
        TheFragebogen.logger.debug(this.constructor.name + ".setAnswer()", "This method might need to be overridden.");
    }

    /**
    Is this QuestionnaireItem answered?
    @returns {boolean}
    */
    isAnswered() {
        return this.answer !== null;
    }

    /**
    Returns the list of predefined options.
    @abstract
    @returns {array} undefined by default.
    */
    getAnswerOptions() {
        return undefined;
    }

    /**
    Adjust the UI if the answer was changed using `setAnswer()`.
    @abstract
    */
    _applyAnswerToUI() {
        TheFragebogen.logger.debug(this.constructor.name + "._applyAnswerToUI()", "This method might need to be overridden.");
    }

    setEnabled(enable) {
        this.enabled = this.isUIcreated() ? enable : false;

        if (this.node !== null) {
            const elements = this.node.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i++) {
                elements[i].disabled = !this.enabled;
            }
        }
    }

    setVisible(visible) {
        this.node.style.visibility = visible ? "visible" : "hidden";
    }

    /**
    Is this QuestionnaireItem ready, i.e., answered if required?
    @returns {boolean}
    */
    isReady() {
        return this.isRequired() ? this.isAnswered() : true;
    }

    /**
    Is this QuestionnaireItem required to be answered?
    @returns {boolean}
    */
    isRequired() {
        return this.required;
    }

    createUI() {
        if (this.isUIcreated()) {
            return this.node;
        }

        this.enabled = false;
        this.uiCreated = true;

        this.node = document.createElement("div");
        this.applyCSS();

        this.node.appendChild(this._createQuestionNode());
        this.node.appendChild(this._createAnswerNode());

        return this.node;
    }

    /**
    Create the UI showing the question.
    @returns {HTMLElement} The div containing the question.
    */
    _createQuestionNode() {
        const questionNode = document.createElement("div");
        questionNode.innerHTML = this.question + (this.required ? "*" : "");
        return questionNode;
    }

    /**
    Create the UI showing the scale.
    @abstract
    @returns {HTMLElement} The HTML container with the scale.
    */
    _createAnswerNode() {
        TheFragebogen.logger.warn(this.constructor.name + "._createAnswerNode()", "This method might need to be overridden.");
    }

    releaseUI() {
        super.releaseUI();
    }

    /**
    Mark this element as required if it was not answered (className + "Required").
    Is called by the Screen if necessary.
    */
    markRequired() {
        if (this.node === null) {
            return;
        }

        const classNameRequired = (this.className !== undefined ? this.className : "") + "Required";
        if (!this.isReady()) {
            this.node.classList.add(classNameRequired);
        } else {
            this.node.classList.remove(classNameRequired);
        }
    }
}
