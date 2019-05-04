/**
A QuestionnaireItem that stores the current URL of the web browser.

@class QuestionnaireItemSystemURL
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
@augments QuestionnaireItemSystemConst
*/
class QuestionnaireItemSystemURL extends QuestionnaireItemSystem {

    constructor() {
    super("URL", window.location.href);
}
}
