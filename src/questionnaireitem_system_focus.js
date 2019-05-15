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
class QuestionnaireItemSystemFocus extends QuestionnaireItemSystem {

    constructor() {
        super(null, "Focus", false);

        this.timeOfLastFocusEvent = null;
        this.inFocus = null;

        this.onLostFocus = ["blur", () => this._onFocusChanged(false), false];
        this.onGainedFocus = ["focus", () => this._onFocusChanged(true), false];
    }

    createUI() {
        super.createUI();
        this.timeOfLastFocusEvent = new Date().getTime();
        this.inFocus = null; // Current state of the focus is unknown

        window.addEventListener(...this.onLostFocus);
        window.addEventListener(...this.onGainedFocus);
    }

    releaseUI() {
        super.releaseUI();

        window.removeEventListener(...this.onLostFocus);
        window.removeEventListener(...this.onGainedFocus);

        this.inFocus = this.inFocus === null ? true : this.inFocus; // Focus might have never changed, so it could still be null
        const newAnswer = this._getAnswer();
        newAnswer.push([this.inFocus, new Date().getTime() - this.timeOfLastFocusEvent]);
        this.setAnswer(newAnswer);
    }

    _onFocusChanged(gotFocus) {
        // Blur event can be triggered multiple times in a row
        if (gotFocus !== this.inFocus) {
            const newAnswer = this._getAnswer();
            newAnswer.push([gotFocus, new Date().getTime() - this.timeOfLastFocusEvent]);
            this.setAnswer(newAnswer);
            this.inFocus = gotFocus;
            this.timeOfLastFocusEvent = new Date().getTime();
        }
    }

    getAnswer() {
        return super.getAnswer();
    }

    _getAnswer() {
        return this.getAnswer() || [];
    }
}
