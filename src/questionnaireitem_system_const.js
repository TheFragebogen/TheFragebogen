/**
A QuestionnaireItem that gives a _constant_ answer.
Useful for store information that are useful in the data to be exported.

@class QuestionnaireItemSystemConst
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
class QuestionnaireItemSystemConst extends QuestionnaireItemSystem {

    /**
    @param {string} question First slot for information.
    @param {string} answer Second slot for information.
    */
    constructor(question, answer) {
        super(null, question, false);
        this.setAnswer(answer);
    }
}
