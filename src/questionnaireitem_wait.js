/**
A QuestionnaireItem that waits for a defined number of seconds before setting itself ready.

No UI is displayed.

@class QuestionnaireItemSystemWait
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSystem
*/
class QuestionnaireItemSystemWait extends QuestionnaireItemSystem {

    /**
    @param {number} waitTime waiting time in seconds
    */
    constructor(waitTime) {
        super(null, "", true);
        this.waitTime = waitTime;

        this.required = true;
        this.timeoutHandle = null;

        TheFragebogen.logger.debug(this.constructor.name + "()", "Set: waitTime as " + this.waitTime);
    }

    createUI() {
        this.setAnswer(null);
        this.timeoutHandle = setTimeout(() => this._waitTimeCallback(), this.waitTime);
    }

    _waitTimeCallback() {
        this.setAnswer(this.waitTime);
    }

    releaseUI() {
        super.releaseUI();
        if (this.timeoutHandle !== null) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    }

    getData() {
        return [this.waitTime];
    }

    _checkData(data) {
        return (data[0] === this.waitTime);
    }

    setData(data) {
        if (!this._checkData(data)) {
            return false;
        }

        return true;
    }
}
