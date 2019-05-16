/**
Abstract controller class for generic UI elements.
Only provides a set of API that must be implemented by childs.

@abstract
@class UIElement
*/
class UIElement {

    /**
    @param {string} [className] CSS class
    */
    constructor(className) {
        this.className = className;

        this.uiCreated = false;
        this.enabled = false;
        this.visible = true;
        this.preloaded = true;

        this.preloadedCallback = null;
        this.node = null;
    }

    /**
    @returns {boolean} true if the UI is created, false if not
    */
    isUIcreated() {
        return this.uiCreated;
    }

    /**
    Creates the UI of the element.
    @abstract
    @return {object}
    */
    createUI() {
        TheFragebogen.logger.debug(this.constructor.name + ".createUI()", "This method must be overridden.");
    }

    /**
    Applies the set className.
    Usually called during createUI().
    @param {string} cssSuffix A suffix to be added to this.className.
    */
    applyCSS(cssSuffix) {
        if (this.isUIcreated() && (this.className !== undefined || cssSuffix !== undefined)) {
            let newClassName = "";
            newClassName += this.className !== undefined ? this.className : "";
            newClassName += cssSuffix !== undefined ? cssSuffix : "";
            this.node.className = newClassName;
        }
    }

    /**
    Destroys the UI.
    */
    releaseUI() {
        this.uiCreated = false;
        this.enabled = false;
        this.node = null;
    }

    /**
    @return {boolean} Is the UI of this element enabled?
    */
    isEnabled() {
        return this.enabled;
    }

    /**
    Setting a component to be enabled incl. UI components.
    By default disables all childs of this.node.
    @param {boolean} enabled
    */
    setEnabled(enable) {
        if (!this.isUIcreated()) {
            return;
        }
        this.enabled = enable;

        if (this.node !== null) {
            const elements = this.node.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i++) {
                elements[i].disabled = !this.enabled;
            }
        }
    }

    /**
    @return {boolean} Is the UI of this element visible?
    */
    isVisible() {
        return this.visible;
    }

    /**
    Set UI visible state.
    @param {boolean} visible
    */
    setVisible(visible) {
        if (!this.isUIcreated()) return;

        this.visible = visible;
        this.node.style.visibility = visible ? "visible" : "hidden";
    }


    /**
    @returns {string} The type of this class usually the name of the class.
    */
    getType() {
        return this.constructor.name;
    }

    /**
    @abstract
    @return {boolean} Is the element ready?
    */
    isReady() {
        TheFragebogen.logger.debug(this.constructor.name + ".isReady()", "This method might need to be overridden.");
        return true;
    }

    /**
    Starts preloading external media.
    Default implementation immedately sends callback `Screen._sendOnScreenPreloadedCallback()`.
    @abstract
    */
    preload() {
        TheFragebogen.logger.debug(this.constructor.name + ".preload()", "Must be overridden for preloading.");
        this._sendOnPreloadedCallback();
    }

    /**
    All external resources loaded?
    @returns {boolean}
    */
    isPreloaded() {
        return this.preloaded;
    }

    /**
    Set callback to get informed when loading of all required external data is finished.
    @param {Function}
    @return {boolean}
    */
    setOnPreloadedCallback(preloadedCallback) {
        if (!(preloadedCallback instanceof Function)) {
            TheFragebogen.logger.error(this.constructor.name + ".setOnPreloadedCallback()", "No callback handle given.");
            return false;
        }

        TheFragebogen.logger.debug(this.constructor.name + ".setOnPreloadedCallback()", "called");
        this.preloadedCallback = preloadedCallback;
        return true;
    }

    /**
    Sends this.onPreloadCallback() to signalize that all required data could be loaded.
    @return {boolean}
    */
    _sendOnPreloadedCallback() {
        if (!(this.preloadedCallback instanceof Function)) {
            TheFragebogen.logger.warn(this.constructor.name + "._sendOnPreloadedCallback()", "called, but no onScreenPreloadedCallback set.");
            return false;
        }
        this.preloaded = true;
        this.preloadedCallback();
    }

    /**
    @abstract
    @return {string} Returns a string representation of this object.
    */
    toString() {
        TheFragebogen.logger.debug(this.constructor.name + ".toString()", "This method might need to be overridden.");
    }
}
