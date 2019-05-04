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
    this.answer = answer;
}

createUI() {}

releaseUI() {}

getData() {
    return [this.getQuestion(), this.getAnswer()];
}

_checkData(data) {
    return (data[0] === this.question && data[1] === this.answer);
}

setData(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.question = data[0];
    this.setAnswer(data[1]);
    return true;
}
}
