/**
An abstract QuestionnaireItem for system-defined answers.
These will be answered automatically and should not provide a UI.

@abstract
@class QuestionnaireItemSystem
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemSystem extends QuestionnaireItem {

    constructor() {
        super(arguments);
    }

    createUI() {
        //NOPE
    }

    setVisible(visible) {
        //NOPE
    }

    isVisible() {
        return false;
    }
}
