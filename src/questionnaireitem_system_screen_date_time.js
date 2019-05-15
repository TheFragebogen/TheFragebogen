/**
A QuestionnaireItemSystem that stores the current date time when this element was used, i.e., `createUI()` called.
The answer is the time and date when the function createUI() is called.

@class QuestionnaireItemSystemScreenDateTime
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
class QuestionnaireItemSystemScreenDateTime extends QuestionnaireItemSystem {

    constructor() {
        super(null, "DateTime", false);
    }

    createUI() {
        super.createUI();
        this.setAnswer(new Date());
    }
}
