/**
A QuestionnaireItemSystem that stores the current date time when this element was used, i.e., `createUI()` called.
The answer is the time and date when the function createUI() is called.

@class QuestionnaireItemSystemScreenDateTime
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
function QuestionnaireItemSystemScreenDateTime() {
    QuestionnaireItemSystem.call(this, null, "DateTime", false);
}
QuestionnaireItemSystemScreenDateTime.prototype = Object.create(QuestionnaireItemSystem.prototype);
QuestionnaireItemSystemScreenDateTime.prototype.constructor = QuestionnaireItemSystemScreenDateTime;

QuestionnaireItemSystemScreenDateTime.prototype.createUI = function() {
    this.answer = new Date().toString();
};
QuestionnaireItemSystemScreenDateTime.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};
QuestionnaireItemSystemScreenDateTime.prototype._checkData = function(data) {
    return (data[0] === this.question);
};
QuestionnaireItemSystemScreenDateTime.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[1]);
    return true;
};
