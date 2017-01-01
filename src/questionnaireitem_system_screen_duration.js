/**
A QuestionnaireItemSystem that stores the time it was shown, i.e., createUI() and releaseUI().

Reports in milliseconds.

@class QuestionnaireItemSystemScreenDuration
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
function QuestionnaireItemSystemScreenDuration() {
    QuestionnaireItemSystem.call(this, null, "Screen Duration", false);
    this.startTime = null;
}
QuestionnaireItemSystemScreenDuration.prototype = Object.create(QuestionnaireItemSystem.prototype);
QuestionnaireItemSystemScreenDuration.prototype.constructor = QuestionnaireItemSystemScreenDuration;

QuestionnaireItemSystemScreenDuration.prototype.createUI = function() {
    this.startTime = new Date().getTime();
};
QuestionnaireItemSystemScreenDuration.prototype.isReady = function() {
    return true;
};
QuestionnaireItemSystemScreenDuration.prototype.releaseUI = function() {
    this.answer = new Date().getTime() - this.startTime;
};
QuestionnaireItemSystemScreenDuration.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};
QuestionnaireItemSystemScreenDuration.prototype._checkData = function(data) {
    return (data[0] === this.question);
};
QuestionnaireItemSystemScreenDuration.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[1]);
    return true;
};
