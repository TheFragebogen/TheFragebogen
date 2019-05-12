/**
QuestionnaireItems that have a predefined set of potential answers.

@abstract
@class QuestionnaireItemDefined
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemDefined extends QuestionnaireItem {

    /**
    @param {string} [className] CSS class
    @param {string} question
    @param {boolean} [required=false]
    @param {array} optionList Possible options.
    */
    constructor(className, question, required, optionList) {
        super(className, question, required);

        if (!(optionList instanceof Array)) {
            TheFragebogen.logger.error(this.constructor.name + "()", "optionList needs to be an Array.");
        }
        this.optionList = optionList;
        this.input = [];

        TheFragebogen.logger.debug(this.constructor.name + "()", "Set: optionList as " + this.optionList);
    }

    getAnswerOptions() {
        return this.optionList;
    }

    releaseUI() {
        super.releaseUI();

        this.input = [];
    }
}
