/**
A QuestionnaireItemSystem that reports statistics on how long the focus was lost or gained.

Reports as an array of tuples [[inFocus, ms], ...].
Each item states how long the survey was under focus (inFocus = true) or how long the focus was lost (inFocus = false).
This QuestionnaireItemSystemFocus uses windows.addEventListener and windows.removeEventListener to listen for new events.
All event listeners are attached as non-capturing.

@class QuestionnaireItemSystemFocus
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
function QuestionnaireItemSystemFocus() {
    QuestionnaireItemSystem.call(this, null, "Focus", false);

    this.answer = [];
    this.timeOfLastFocusEvent = null;
    this.inFocus = null;
}
QuestionnaireItemSystemFocus.prototype = Object.create(QuestionnaireItemSystem.prototype);
QuestionnaireItemSystemFocus.prototype.constructor = QuestionnaireItemSystemFocus;

QuestionnaireItemSystemFocus.prototype.createUI = function() {
    this.timeOfLastFocusEvent = new Date().getTime();
    this.inFocus = null; // Current state of the focus is unknown

    this.onLostFocus = (this._onLostFocus).bind(this);
    window.addEventListener("blur", this.onLostFocus, false);

    this.onGainedFocus = (this._onGainedFocus).bind(this);
    window.addEventListener("focus", this.onGainedFocus, false);
};

QuestionnaireItemSystemFocus.prototype.releaseUI = function() {
    window.removeEventListener("blur", this.onLostFocus, false);
    window.removeEventListener("focus", this.onGainedFocus, false);

    this.inFocus = this.inFocus === null ? true : this.inFocus; // Focus might have never changed, so it could still be null
    this.getAnswer().push([this.inFocus, new Date().getTime() - this.timeOfLastFocusEvent]);
};

QuestionnaireItemSystemFocus.prototype._onLostFocus = function() {
    // Blur event can be triggered multiple times in a row
    if (this.inFocus !== false) {
        this.getAnswer().push([true, new Date().getTime() - this.timeOfLastFocusEvent]);
        this.inFocus = false;
        this.timeOfLastFocusEvent = new Date().getTime();
    }
};

QuestionnaireItemSystemFocus.prototype._onGainedFocus = function() {
    if (this.inFocus !== true) {
        this.getAnswer().push([false, new Date().getTime() - this.timeOfLastFocusEvent]);
        this.inFocus = true;
        this.timeOfLastFocusEvent = new Date().getTime();
    }
};

QuestionnaireItemSystemFocus.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};

QuestionnaireItemSystemFocus.prototype.isReady = function() {
    return true;
};

QuestionnaireItemSystemFocus.prototype.getData = function() {
    return this.getAnswer();
};

QuestionnaireItemSystemFocus.prototype._checkData = function(data) {
    if (!Array.isArray(data)) {
        return false;
    }

    for (var i = 0; i < data.length; i++) {
        if (!Array.isArray(data[i]) || typeof data[i][0] !== "boolean" || !Number.isInteger(data[i][1])) {
            return false;
        }
    }
    return true;
};

QuestionnaireItemSystemFocus.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data);
    return true;
};
