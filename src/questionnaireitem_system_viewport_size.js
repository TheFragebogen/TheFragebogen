/**
A QuestionnaireItemSystem that stores the dimension of the viewport.

Reports the viewport as array [document.documentElement.clientWidth, document.documentElement.clientHeight] in pixels.
It gets measured at the time of createUI().

@class QuestionnaireItemSystemViewportSize
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
function QuestionnaireItemSystemViewportSize() {
    QuestionnaireItemSystem.call(this, null, "Viewport size", false);
}
QuestionnaireItemSystemViewportSize.prototype = Object.create(QuestionnaireItemSystem.prototype);
QuestionnaireItemSystemViewportSize.prototype.constructor = QuestionnaireItemSystemViewportSize;

QuestionnaireItemSystemViewportSize.prototype.createUI = function() {
    this.answer = [document.documentElement.clientWidth, document.documentElement.clientHeight];
};

QuestionnaireItemSystemViewportSize.prototype.isReady = function() {
    return true;
};

QuestionnaireItemSystemViewportSize.prototype.releaseUI = function() {};
QuestionnaireItemSystemViewportSize.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};
