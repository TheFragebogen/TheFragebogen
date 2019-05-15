/**
A screen that presents one or more UIElements.
All UIElements are visible and enabled by default.
Ready is reported when all UIElements reported ready AND the user pressed the presented button.

Supports _pagination_.
Default paginator is `PaginateUIButton`.

@class ScreenUIElements
@augments Screen
*/
class ScreenUIElements extends Screen {

    /**
    @param {string} [className=] CSS class
    @param {...UIElement} arguments an array containing the UIElements of the screen
    */
    constructor(className) {
        super();

        const localArguments = Array.prototype.slice.call(arguments);

        if (className instanceof String) {
            this.className = className;
            localArguments.splice(0, 1);
        }

        for (let i = 0; i < localArguments.length; i++) {
            if (!(localArguments[i] instanceof UIElement)) {
                TheFragebogen.logger.error(this.constructor.name + "()", "This argument (index " + i + " is not an UIElement: " + localArguments[i]);
            }
        }
        this.uiElements = localArguments.filter((element) => element instanceof UIElement);

        if (this.uiElements.length < 1) {
            TheFragebogen.logger.error(this.constructor.name + "()", "No UIElements were passed to constructor.");
        }

        this.paginateUI = new PaginateUIButton(undefined, undefined, 1);
    }

    setPaginateUI(paginateUI) {
        if (this.isUIcreated()) return false;
        if (!(paginateUI instanceof PaginateUI || paginateUI === null)) return false;

        this.paginateUI = paginateUI;
        TheFragebogen.logger.debug(this.constructor.name + ".setPaginateUI()", "Set paginateUI.");
        return true;
    }

    createUI() {
        this.node = document.createElement("div");
        this.applyCSS();

        for (let i = 0; i < this.uiElements.length; i++) {
            if (this.uiElements[i].createUI === undefined) {
                TheFragebogen.logger.warn(this.constructor.name + ".createUI()", "Element[" + i + "] has no 'createUI' method");
                continue;
            }

            const uiElementNode = this.uiElements[i].createUI();
            if (uiElementNode instanceof HTMLElement) {
                this.node.appendChild(uiElementNode);
            } else {
                TheFragebogen.logger.warn(this.constructor.name + ".createUI()", "Element[" + i + "].createUI() did not a HTMLElement.");
            }
        }

        if (this.paginateUI != null) {
            this.paginateUI.setPaginateCallback((relativeScreenId) => this._sendPaginateCallback(relativeScreenId));
            this.node.appendChild(this.paginateUI.createUI());
        }

        return this.node;
    }

    releaseUI() {
        super.releaseUI();
        for (let i = 0; i < this.uiElements.length; i++) {
            this.uiElements[i].releaseUI();
        }
    }

    /**
    Enables all the elements of the screen.
    */
    start() {
        TheFragebogen.logger.info(this.constructor.name + ".start()", "");

        for (let i = 0; i < this.uiElements.length; i++) {
            this.uiElements[i].setEnabled(true);
        }
    }

    /**
    Are all UIElementInteractive ready?
    @returns {boolean}
    */
    isReady() {
        let ready = true;

        for (let i = 0; i < this.uiElements.length; i++) {
            if (this.uiElements[i] instanceof UIElementInteractive) {
                if (!this.uiElements[i].isReady()) {
                    ready = false;
                }
                this.uiElements[i].markRequired();
            }
        }
        return ready;
    }

    /**
     Returns the data of QuestionnaireItem (UIElementInteractive are omitted) as an two-dimensional array.
     The data of each questionnaire item is subdivided in 4 columns:
     1. QuestionnaireItem.getType()
     2. QuestionnaireItem.getQuestion()
     3. QuestionnaireItem.getAnswerOptions()
     4. QuestionnaireItem.getAnswer() || QuestionnaireItem.getAnswerChangelog()
     @param {boolean} includeAnswerChangelog Should the the changelog of the answer be reported?
     @returns {array}
     */
    getData(includeAnswerChangelog) {
        const data = [
            [],
            [],
            [],
            []
        ];

        for (let i = 0; i < this.uiElements.length; i++) {
            if ((this.uiElements[i] instanceof QuestionnaireItem)) {
                data[0].push(this.uiElements[i].getType());
                data[1].push(this.uiElements[i].getQuestion());
                data[2].push(this.uiElements[i].getAnswerOptions());
                if (includeAnswerChangelog) {
                    data[3].push(this.uiElements[i].getAnswerChangelog());
                } else {
                    data[3].push(this.uiElements[i].getAnswer());
                }
            }
        }
        return data;
    }

    preload() {
        TheFragebogen.logger.debug(this.constructor.name + ".preload()", "called");

        for (let i = 0; i < this.uiElements.length; i++) {
            this.uiElements[i].setOnPreloadedCallback(() => this._onUIElementPreloaded());
            this.uiElements[i].preload();
        }
    }

    /**
    All external resources loaded?
    @abstract
    @returns {boolean}
    */
    isPreloaded() {
        for (let i = 0; i < this.uiElements.length; i++) {
            if (!this.uiElements[i].isPreloaded()) return false;
        }
        return true;
    }

    _onUIElementPreloaded() {
        for (let i = 0; i < this.uiElements.length; i++) {
            if (!this.uiElements[i].isPreloaded()) return;
        }

        this._sendOnPreloadedCallback();
    }
}
