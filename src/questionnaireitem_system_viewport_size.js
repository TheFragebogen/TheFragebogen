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
class QuestionnaireItemSystemViewportSize extends QuestionnaireItemSystem {

    constructor() {
        super(null, "Viewport size", false);
    }

    createUI() {
        super.createUI();
        this.setAnswer([document.documentElement.clientWidth, document.documentElement.clientHeight]);
    }
}
