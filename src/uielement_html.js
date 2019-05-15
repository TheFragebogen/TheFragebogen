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
        super(className);

        this.html = html;
    }

    createUI() {
        this.node = document.createElement("div");
        this.node.innerHTML = this.html;
        this.uiCreated = true;

        this.applyCSS();

        return this.node;
    }
}
