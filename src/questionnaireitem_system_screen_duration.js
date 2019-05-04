/**
A QuestionnaireItemSystem that stores the time it was shown, i.e., createUI() and releaseUI().

Reports in milliseconds.

@class QuestionnaireItemSystemScreenDuration
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
class QuestionnaireItemSystemScreenDuration extends QuestionnaireItemSystem {

    constructor() {
    super(null, "Screen Duration", false);
    this.startTime = null;
}

createUI() {
    this.startTime = new Date().getTime();
}

isReady() {
    return true;
}

releaseUI() {
    this.answer = new Date().getTime() - this.startTime;
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
