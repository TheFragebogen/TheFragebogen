/**
A QuestionnaireItem that stores the current URL of the web browser.

@class QuestionnaireItemSystemURL
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
@augments QuestionnaireItemSystemConst
*/
function QuestionnaireItemSystemURL() {
    QuestionnaireItemSystemConst.call(this, "URL", window.location.href);
}
QuestionnaireItemSystemURL.prototype = Object.create(QuestionnaireItemSystemConst.prototype);
QuestionnaireItemSystemURL.prototype.constructor = QuestionnaireItemSystemURL;
