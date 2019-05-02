/**
A QuestionnaireItemSystem that stores the size of the screen.

Reports as array with width and height in pixels.

@class QuestionnaireItemSystemScreenSize
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
function QuestionnaireItemSystemScreenSize() {
    QuestionnaireItemSystem.call(this, null, "Screensize", false);
}
QuestionnaireItemSystemScreenSize.prototype = Object.create(QuestionnaireItemSystem.prototype);
QuestionnaireItemSystemScreenSize.prototype.constructor = QuestionnaireItemSystemScreenSize;

QuestionnaireItemSystemScreenSize.prototype.createUI = function() {
};
QuestionnaireItemSystemScreenSize.prototype.isReady = function() {
    return true;
};
QuestionnaireItemSystemScreenSize.prototype.releaseUI = function() {
};
QuestionnaireItemSystemScreenSize.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};
QuestionnaireItemSystemScreenSize.prototype.getAnswer = function() {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return [width, height];
};
