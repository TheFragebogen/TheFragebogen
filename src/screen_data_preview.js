/**
A screen that shows all data that is _currently_ stored by the ScreenController.

Reports nothing.

Supports _pagination_.
Default paginator is `PaginateUIButton`.

@class ScreenDataPreview
@augments Screen
*/
class ScreenDataPreview extends Screen {

    /**
    @param {string} [className] CSS class
    @param {boolean} [includeAnswerChangelog=false] Should the the changelog of the answer be reported?
    */
    constructor(className, includeAnswerChangelog) {
        super(className);

        this.includeAnswerChangelog = includeAnswerChangelog;

        this.data = null;
        this.className = className;

        this.getDataFromScreencontroller = null;

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
        //Request data
        if (this.getDataFromScreencontroller instanceof Function) {
            TheFragebogen.logger.debug(this.constructor.name + "._sendGetDataFromScreencontroller()", "called");
            this.data = this.getDataFromScreencontroller(this.includeAnswerChangelog);
        }

        this.node = document.createElement("div");
        this.node.innerHTML = "<h1>Data Preview</h1>";
        this.applyCSS();

        const tblBody = document.createElement("tbody");
        for (let i = 0; i < this.data.length; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < this.data[i].length; j++) {

                const cell = document.createElement(i == 0 ? "th" : "td");

                cell.innerHTML = this.data[i][j];
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }

        const tbl = document.createElement("table");
        tbl.appendChild(tblBody);
        this.node.appendChild(tbl);

        if (this.paginateUI != null) {
            this.paginateUI.setPaginateCallback((relativeScreenId) => this._sendPaginateCallback(relativeScreenId));
            this.node.appendChild(this.paginateUI.createUI());
        }

        return this.node;
    }

    releaseUI() {
        super.releaseUI();
        this.data = null;
    }

    /**
    Set the function pointer for requesting the ScreenController's _raw_ data.
    @param {function} function
    @returns {boolean} true if parameter was a function
    */
    setGetRawDataCallback(getDataFromScreencontroller) {
        if (getDataFromScreencontroller instanceof Function) {
            TheFragebogen.logger.debug(this.constructor.name + ".setGetRawDataCallback()", "called");
            this.getDataFromScreencontroller = getDataFromScreencontroller;
            return true;
        }
        return false;
    }
}
