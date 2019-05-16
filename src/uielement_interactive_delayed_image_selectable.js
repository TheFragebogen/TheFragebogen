/**
Simulates the delayed loading of an image that is selectable (via checkbox).
During the load process a load animation (another image) is shown.

DEVELOPER:
* does not support preloading the images

@class UIElementInteractiveDelayedImageSelectable
@augments UIElement
@augments UIElementInteractive
*/
class UIElementInteractiveDelayedImageSelectable extends UIElementInteractive {

    /**
    @param {string} [className] CSS class
    @param {string} loadAnimationURL URL of the load animation.
    @param {string} imageURL URL of the image.
    @param {string} imageCaption The caption of the image.
    @param {float} loadDelay The delay in ms.
    @param {int} [readyMode=0] 0: immediately, 1: selected, 2: not selected, 3: ready on delayed load, 4: case 1 & 3; 5: case 2 & 3
    */
    constructor(className, loadAnimationURL, imageURL, imageCaption, imageDelay, readyMode) {
        super(className);

        this.loadAnimationURL = loadAnimationURL;
        this.imageURL = imageURL;
        this.imageCaption = imageCaption;
        this.imageDelay = imageDelay;

        this.isSelected = false;
        this.readyMode = [0, 1, 2, 3, 4, 5].indexOf(readyMode) === -1 ? 0 : readyMode;

        this.checkbox = null;
        this.isImageLoaded = false;
    }

    createUI() {
        this.node = document.createElement("span");
        this.uiCreated = true;
        this.applyCSS();

        this.checkbox = document.createElement("input");
        this.checkbox.type = "checkbox";
        this.node.appendChild(this.checkbox);
        //Apply value to UI
        this.checkbox.checked = this.isSelected;

        const image = new Image();
        image.alt = this.imageCaption;
        //Load delay for the image
        if (this.imageDelay > 0) {
            const imageURL = this.imageURL;
            image.src = this.loadAnimationURL;
            setTimeout(() => {
                    image.src = imageURL;
                    this.isImageLoaded = true;
                },
                this.imageDelay
            );
        } else {
            image.src = this.imageURL;
        }
        this.node.appendChild(image);

        image.addEventListener("click", (event) => this._onSelected(event));
        this.checkbox.addEventListener("changed", (event) => this._onSelected(event));
        this.node.addEventListener("click", (event) => this._onSelected(event));

        this.uiCreated = true;

        return this.node;
    }

    releaseUI() {
        super.releaseUI();

        this.checkbox = null;
        this.isImageLoaded = false;
    }

    isReady() {
        switch (this.readyMode) {
            case 0:
                return true;
            case 1:
                return this.isSelected;
            case 2:
                return this.isSelected === false;
            case 3:
                return this.isImageLoaded;
            case 4:
                return this.isImageLoaded && this.isSelected;
            case 5:
                return this.isImageLoaded && this.isSelected === false;
        }
    }

    _onSelected(event) {
        if (!this.isUIcreated()) return;

        if ([4, 5].indexOf(this.readyMode) != -1 && !this.isImageLoaded) return;

        this.isSelected = !this.isSelected;
        this.checkbox.checked = this.isSelected;

        event.stopPropagation();
    }
}
