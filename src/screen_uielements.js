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

        for (let i in localArguments) {
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

        for (let index in this.uiElements) {
            if (this.uiElements[index].createUI === undefined) {
                TheFragebogen.logger.warn(this.constructor.name + ".createUI()", "Element[" + index + "] has no 'createUI' method");
                continue;
            }

            const uiElementNode = this.uiElements[index].createUI();
            if (uiElementNode instanceof HTMLElement) {
                this.node.appendChild(uiElementNode);
            } else {
                TheFragebogen.logger.warn(this.constructor.name + ".createUI()", "Element[" + index + "].createUI() did not a HTMLElement.");
            }
        }

        if (this.paginateUI != null) {
            this.paginateUI.setPaginateCallback(() => this._sendPaginateCallback());
            this.node.appendChild(this.paginateUI.createUI());
        }

        return this.node;
    }

    releaseUI() {
        super.releaseUI();
        for (let index in this.uiElements) {
            this.uiElements[index].releaseUI();
        }
    }

    /**
    Enables all the elements of the screen.
    */
    start() {
        TheFragebogen.logger.info(this.constructor.name + ".start()", "");

        for (let index in this.uiElements) {
            this.uiElements[index].setEnabled(true);
        }
    }

    /**
    Are all UIElementInteractive ready?
    @returns {boolean}
    */
    isReady() {
        let ready = true;

        for (let index in this.uiElements) {
            if (this.uiElements[index] instanceof UIElementInteractive) {
                if (!this.uiElements[index].isReady()) {
                    ready = false;
                }
                this.uiElements[index].markRequired();
            }
        }
        return ready;
    }

    /**
     Returns the data of QuestionnaireItem (UIElementInteractive are omitted) in CSV format.
     The data of each questionnaire item is subdivided in 4 columns:
     1. QuestionnaireItem.getType()
     2. QuestionnaireItem.getQuestion()
     3. QuestionnaireItem.getAnswerOptions()
     4. QuestionnaireItem.getAnswer()
     @returns {array}
     */
    getData() {
        const data = [
            [],
            [],
            [],
            []
        ];

        for (let index in this.uiElements) {
            if ((this.uiElements[index] instanceof QuestionnaireItem)) {
                data[0].push(this.uiElements[index].getType());
                data[1].push(this.uiElements[index].getQuestion());
                data[2].push(this.uiElements[index].getAnswerOptions());
                data[3].push(this.uiElements[index].getAnswer());
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
