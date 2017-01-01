/**
An abstract QuestionnaireItem for system-defined answers.
These will be answered automatically and should not provide a UI.
 
@abstract
@class QuestionnaireItemSystem
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
function QuestionnaireItemSystem() {
    QuestionnaireItem.apply(this, arguments);
}
QuestionnaireItemSystem.prototype = Object.create(QuestionnaireItem.prototype);
QuestionnaireItemSystem.prototype.constructor = QuestionnaireItemSystem;
QuestionnaireItemSystem.setVisible = function(visible) {
    //NOPE
};
QuestionnaireItemSystem.isVisible = function() {
    return false;
};
