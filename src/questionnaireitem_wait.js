/**
A QuestionnaireItem that waits for a defined number of seconds before setting itself ready.

No UI is displayed.

@class QuestionnaireItemSystemWait
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem

@param {number} waitTime waiting time in seconds
*/
function QuestionnaireItemSystemWait(waitTime) {
    QuestionnaireItemSystem.call(this, null, "", true);
    this.waitTime = waitTime;

    this.required = true;
    this.timeoutHandle = null;

    TheFragebogen.logger.debug(this.constructor.name + "()", "Set: waitTime as " + this.waitTime);
}
QuestionnaireItemSystemWait.prototype = Object.create(QuestionnaireItemSystem.prototype);
QuestionnaireItemSystemWait.prototype.constructor = QuestionnaireItemSystemWait;

QuestionnaireItemSystemWait.prototype.createUI = function() {
    this.setAnswer(null);
    this.timeoutHandle = setTimeout((this._waitTimeCallback).bind(this), this.waitTime);
};

QuestionnaireItemSystemWait.prototype._waitTimeCallback = function() {
    this.setAnswer(this.waitTime);
};

QuestionnaireItemSystemWait.prototype.releaseUI = function() {
    if (this.timeoutHandle !== null) {
        clearTimeout(this.timeoutHandle);
        this.timeoutHandle === null;
    }
};

QuestionnaireItemSystemWait.prototype.getData = function() {
    return [this.waitTime];
};

QuestionnaireItemSystemWait.prototype._checkData = function(data) {
    return (data[0] === this.waitTime);
};

QuestionnaireItemSystemWait.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    return true;
};
