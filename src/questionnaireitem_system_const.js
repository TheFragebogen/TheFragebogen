/**
A QuestionnaireItem that gives a _constant_ answer.
Useful for store information that are useful in the data to be exported.

@class QuestionnaireItemSystemConst
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem

@param {string} question First slot for information.
@param {string} answer Second slot for information.
*/
function QuestionnaireItemSystemConst(question, answer) {
    QuestionnaireItemSystem.call(this, null, question, false);
    this.answer = answer;
}
QuestionnaireItemSystemConst.prototype = Object.create(QuestionnaireItemSystem.prototype);
QuestionnaireItemSystemConst.prototype.constructor = QuestionnaireItemSystemConst;

QuestionnaireItemSystemConst.prototype.createUI = function() {};

QuestionnaireItemSystemConst.prototype.releaseUI = function() {};

QuestionnaireItemSystemConst.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};

QuestionnaireItemSystemConst.prototype._checkData = function(data) {
    return (data[0] === this.question && data[1] === this.answer);
};

QuestionnaireItemSystemConst.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.question = data[0];
    this.setAnswer(data[1]);
    return true;
};
