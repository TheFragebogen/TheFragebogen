 /**
Provides a UI for pagination between `Screens`.

Implements a button to continue to the following `Screen`.

@class PaginateUIButton
@augments PaginateUI
*/
 class PaginateUIButton extends PaginateUI {

     /**
     @param {string} [className] CSS class
     @param {number} [relativeIdNext=undefined] The relativeId of the next screen. If undefined, no back button will be generated.
     @param {number} [relativeIdback=undefined] The relativeId of the next screen. If undefined, no back button will be generated.
     @param {string} [labelBack="Back"] The caption for the back-button.
     @param {string} [labelNext="Next"] The caption for the next-button.
     */
     constructor(className, relativeIdBack, relativeIdNext, labelBack, labelNext) {
         super(className);

         this.relativeIdBack = relativeIdBack;
         this.relativeIdNext = relativeIdNext;
         if (this.relativeIdBack === undefined && this.relativeIdNext === undefined) {
             TheFragebogen.logger.error(this.constructor.name + "()", "relativeIdBack and relativeIdNext are undefined. No buttons will be created.");
         }
         if (typeof(this.relativeIdBack) !== "number" && typeof(this.relativeIdNext) !== "number") {
             TheFragebogen.logger.error(this.constructor.name + "()", "relativeIdBack and relativeIdNext should be numbers.");
         }

         this.labelBack = labelBack === undefined ? "Back" : labelBack;
         this.labelNext = labelNext === undefined ? "Next" : labelNext;

         this.node = null;
     }

     /**
     @returns {boolean} true if the UI is created, false if not
     */
     isUIcreated() {
         return this.uiCreated;
     }

     createUI() {
         this.node = document.createElement("div");
         this.node.className = this.className;

         if (this.relativeIdBack !== undefined) {
             const buttonBack = document.createElement("input");
             buttonBack.type = "button";
             buttonBack.value = this.labelBack;
             buttonBack.addEventListener("click", () => this._sendPaginateCallback(this.relativeIdBack));
             this.node.appendChild(buttonBack);
         }

         if (this.relativeIdNext !== undefined) {
             const buttonNext = document.createElement("input");
             buttonNext.type = "button";
             buttonNext.value = this.labelNext;
             buttonNext.addEventListener("click", () => this._sendPaginateCallback(this.relativeIdNext));
             this.node.appendChild(buttonNext);
         }
         return this.node;
     }

     releaseUI() {
         this.node = null;
     }
 }
