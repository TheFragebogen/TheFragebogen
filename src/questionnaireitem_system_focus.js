/**
A QuestionnaireItemSystem that stores the how often and how long the focus was moved away from the study.

Reports as array with entries how log the focus was lost each time in milliseconds.

@class QuestionnaireItemSystemFocus
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
function QuestionnaireItemSystemFocus() {
    QuestionnaireItemSystem.call(this, null, "Focus", false);

    this.focusLossDurations = [];
    this.timeOfLastFocusLoss = new Date().getTime();
    this.inFocus = null;
}
QuestionnaireItemSystemFocus.prototype = Object.create(QuestionnaireItemSystem.prototype);
QuestionnaireItemSystemFocus.prototype.constructor = QuestionnaireItemSystemFocus;

QuestionnaireItemSystemFocus.prototype.createUI = function() {
    // Window lost focus
    window.addEventListener("blur", (this._onlostfocus).bind(this), false);
    // Window got focused
    window.addEventListener("focus", (this._ongainedfocus).bind(this), false);
};
QuestionnaireItemSystemFocus.prototype._onlostfocus = function() {
    // Blur event can be triggered multiple times in a row. inFocus can prevent this.
    if (this.inFocus == null || this.inFocus == true) {
        this.inFocus = false;
        this.timeOfLastFocusLoss = new Date().getTime();
    }
};
QuestionnaireItemSystemFocus.prototype._ongainedfocus = function() {
    if (this.inFocus == null || this.inFocus == false) {
        this.inFocus = true;
        this.focusLossDurations.push(new Date().getTime() - this.timeOfLastFocusLoss);
    }
};
QuestionnaireItemSystemFocus.prototype.isReady = function() {
    return true;
};
QuestionnaireItemSystemFocus.prototype.getData = function() {
    return this.focusLossDurations;
};
