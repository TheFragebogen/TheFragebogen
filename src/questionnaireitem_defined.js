/**
QuestionnaireItems that have a predefined set of potential answers.

@abstract
@class QuestionnaireItemDefined
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem

@param {string} [className] CSS class
@param {string} question
@param {boolean} [required=false]

@param {array} optionList Possible options.
*/
function QuestionnaireItemDefined(className, question, required, optionList) {
    QuestionnaireItem.call(this, className, question, required);

    if (!(optionList instanceof Array)) {
        TheFragebogen.logger.error(this.constructor.name + "()", "optionList needs to be an Array.");
    }
    this.optionList = optionList;
    this.input = [];

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: optionList as " + this.optionList);
}
QuestionnaireItemDefined.prototype = Object.create(QuestionnaireItem.prototype);
QuestionnaireItemDefined.prototype.constructor = QuestionnaireItem;

QuestionnaireItemDefined.prototype.getAnswerOptions = function() {
    return this.optionList;
};
