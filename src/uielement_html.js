/**
A UIElement that shows non-interactive UI, i.e., plain HTML.
Provided HTML is encapsulated into a div and div.className is set.

@class UIElementHTML
@augments UIElement

*/
class UIElementHTML extends UIElement {
    /**
    @param {string} [className] CSS class
    @param {string} html HTML
    */
    constructor(className, html) {
        super();

        this.className = className;
        this.html = html;

        this.node = null;

        TheFragebogen.logger.debug(this.constructor.name + "()", "className as " + this.className + " and html as " + this.html);
    }

    createUI() {
        this.node = document.createElement("div");
        this.node.className = this.className;
        this.node.innerHTML = this.html;

        return this.node;
    }

    releaseUI() {
        super.releaseUI();
        this.node = null;
    }

    setEnabled(enabled) {
        //NOPE
    }

    setVisible(visible) {
        this.visible = visible;
        this.node.hidden = this.visible ? "" : "hidden";
    }
}
