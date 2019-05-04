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
    this.answer = new Date().toString();
}

getData() {
    return [this.getQuestion(), this.getAnswer()];
}

_checkData(data) {
    return (data[0] === this.question);
}

setData(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[1]);
    return true;
}
}
