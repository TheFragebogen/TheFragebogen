/**
A QuestionnaireItem for free-hand input (drawing or writing).
Uses mouse simulation to draw a canvas.

Reports answer as base64-coded PNG image.
ATTENTION: answer is stored on calling releaseUI() and (if UI is created) getAnswer() only.
ATTENTION: disables context menu (i.e., right click menu).

Supports HDPI.

Apply "cursor: none;" if stylus input is used.

@class QuestionnaireItemWrite
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemWrite extends QuestionnaireItem {

    /**
    @param {string} [className] CSS class
    @param {string} [question] The question
    @param {boolean} [required=false] Is this QuestionnaireItem required to be answered?
    @param {string} [backgroundImg] URL of the background image
    @param {number} [height=240]
    @param {number} [width=320]
    @param {number} [drawSize=1] The radius of the pen in px.
    @param {number} [eraserSize=10] The radius of the eraser in px.
    */
    constructor(className, question, required, backgroundImg, width, height, drawColor, drawSize, eraserSize) {
        super(className, question, required);

        this.backgroundImg = backgroundImg !== undefined ? backgroundImg : "";
        this.height = !isNaN(height) && height > 0 ? height : 240;
        this.width = !isNaN(width) && width > 0 ? width : 320;

        this.pixelRatio = 1; //HDPI support.
        this.drawColor = (typeof(drawColor) === "string" ? drawColor : "black");
        this.drawSize = !isNaN(drawSize) && drawSize > 0 ? drawSize : 1;
        this.eraserSize = !isNaN(eraserSize) && eraserSize > 0 ? eraserSize : 10;

        TheFragebogen.logger.debug(this.constructor.name + "()", "Set: backgroundImg as " + this.backgroundImg + ", height as " + this.height + ", width as " + this.width + ", drawColor as " + this.drawColor + ", drawSize as " + this.drawSize + " and eraserSize as " + this.eraserSize);

        this.painting = false;
        this.penWasDown = false;
        this.eraserMode = false; //True: eraser, False: draw
        this.lastDrawX = null;
        this.lastDrawY = null;

        this.context = null;
    }

    _createAnswerNode() {
        const answerNode = document.createElement("div");
        const canvas = document.createElement("canvas");
        if (this.width !== null) {
            canvas.width = this.width;
        }
        if (this.height !== null) {
            canvas.height = this.height;
        }
        answerNode.appendChild(canvas);

        this.context = canvas.getContext("2d");
        this.context.lineJoin = "round";

        //Center background image
        if (this.backgroundImg !== null) {
            canvas.style.background = "url('" + this.backgroundImg + "') 50% 50% / contain no-repeat";
        }

        canvas.addEventListener("mousedown", (event) => this.onWritingStart(event));
        canvas.addEventListener("mousemove", (event) => this.onWriting(event));
        canvas.addEventListener("mouseup", () => this.onWritingStop());
        canvas.addEventListener("mouseout", () => this.onWritingStop());

        //Disable contextmenu, so right click can be
        canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        }, true);

        //BEGIN: EXPERIMENTAL
        //This uses allows us to be HDPI conform!
        //Only works in Chrome so far! And it is a hack! See: http://www.html5rocks.com/en/tutorials/canvas/hidpi/
        this.pixelRatio = window.devicePixelRatio || 1 / this.context.webkitBackingStorePixelRatio || 1;

        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;

        canvas.width = canvas.width * this.pixelRatio;
        canvas.height = canvas.height * this.pixelRatio;

        this.context.scale(this.pixelRatio, this.pixelRatio);
        //END: EXPERIMENTAL
        return answerNode;
    }

    applyAnswerToUI() {
        if (this.isAnswered()) {
            TheFragebogen.logger.debug(this.constructor.name + "_createAnswerNode()", "Already answered; restoring image.");

            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            const img = new Image();
            img.addEventListener("load", () => {
                const ratio_w = img.width / parseInt(this.context.canvas.style.width);
                const ratio_h = img.height / parseInt(this.context.canvas.style.height);
                this.context.scale(1 / ratio_w, 1 / ratio_h);
                this.context.drawImage(img, 0, 0);
                this.context.scale(ratio_w, ratio_h);
            });
            img.addEventListener("error", () => TheFragebogen.logger.error("Could not restore image from answer."));
            img.src = this.getAnswer();
        }
    }

    /**
    Pen is down on the paper.
    */
    onWritingStart(event) {
        if (!this.isEnabled()) {
            return;
        }

        this.painting = true;
        this.eraserMode = event.button !== 0; //The not-left mouse button is the eraser
        this.penWasDown = false;

        this.onWriting(event);
    }

    /**
    Pen is moving on the paper.
    */
    onWriting(event) {
        if (!this.isEnabled() || !this.painting) {
            return;
        }

        const x = event.pageX - event.target.offsetLeft;
        const y = event.pageY - event.target.offsetTop;

        this.context.beginPath();

        if (this.eraserMode) {
            this.context.globalCompositeOperation = "destination-out";
            this.context.arc(x, y, this.eraserSize, 0, Math.PI * 2, false);
            this.context.fill();
        } else {
            this.context.globalCompositeOperation = "source-over";
            if (this.penWasDown) {
                this.context.moveTo(this.lastDrawX, this.lastDrawY);
            } else {
                this.context.moveTo(x - 1, y);
            }

            this.context.lineTo(x, y);
            this.context.strokeStyle = this.drawColor;
            this.context.lineWidth = this.drawSize;
            this.context.stroke();
        }

        //The following lines cannot be put above, because it must be done after the draw.
        this.penWasDown = true;
        this.lastDrawX = x;
        this.lastDrawY = y;
    }

    /**
    Pen left paper, so save the answer.
    */
    onWritingStop() {
        this.painting = false;

        if (this.isAnswered()) {
            this.markRequired();
        }
        this._sendReadyStateChanged();
    }

    getAnswer() {
        if (this.isUIcreated() && this.isAnswered()) {
            this.setAnswer(this.context.canvas.toDataURL("image/png"));
        }

        return super.getAnswer();
    }

    releaseUI() {
        //Store answer from UI component
        this.getAnswer();

        super.releaseUI();

        this.context = null;
        this.pixelRatio = 1;
        this.lastDrawX = null;
        this.lastDrawY = null;
        this.penWasDown = false;
        this.painting = false;
        this.eraserMode = false;
    }
}
