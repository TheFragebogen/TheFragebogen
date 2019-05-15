/**
A base class for QuestionnaireItems using a SVG as scale.

The SVG is required to have click-positions representing the potential answers (e.g., path, rect, ellipse).
Actionlistener are added to these while the id of each answer-element represents the _answer_.
In addition, the SVG must contain an element `id="cross"` that shows the current answer (if set).

DEVELOPER:
To implement a new scale:
1. Create an SVG
1.1. Add a id=cross
1.2. Add click-position with _unique_ id (Non-unique ids also work, but setAnswer() will misbehave).
2. Override _setupSVG(): Set up the SVG and viewbox.
3. Override _getAnswerElements()
4. Override getAnswerOptions

ATTENTION:
Creating the SVG is not straight forward as the cross-element is moved to an answer using transform.
We had some trouble, if each answer-element had an individual transform (e.g., matrix) instead of an absolute position.

[Inkscape](http://inkscape.org) might add those transform if copy-and-paste is used.
To remove those transforms group and ungroup all answer-elements in Inkscape.

To test your SVG, you can use the following code (open the SVG in Chrome and open developer mode).
The cross should be positioned accordingly.

<code>
const cross=document.getElementById("cross")
const answerA = document.getElementById('10'); //Change if you use different answer

cross.setAttributeNS(null, "transform", "translate(0,0)"); //Reset cross position

transform = cross.getTransformToElement(answerA)
crossBB = cross.getBBox()
answerABB = answerA.getBBox()
cross.setAttributeNS(null, "transform", "translate(" + (-transform.e + Math.abs(answerABB.x - crossBB.x) - crossBB.width/2 + answerABB.width/2) + ",0)");
</code>

@class QuestionnaireItemSVG
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
*/
class QuestionnaireItemSVG extends QuestionnaireItem {

    /**
    @param {string} [className] CSS class
    @param {string} question
    @param {boolean} [required=false]
    */
    constructor(className, question, required) {
        super(className, question, required);

        this.scaleImage = null;
        this.answerMap = {};
        this.crossImage = null;
    }

    _createAnswerNode() {
        const answerNode = document.createElement("div");

        this.scaleImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._setupSVG();

        this.crossImage = this.scaleImage.getElementById("cross");
        //Problem identified here by the tests while using Safari 7.0.6 --- this.crossImage === null
        if (this.crossImage === null) {
            answerNode.innerHTML = '"QuestionnaireItemSVG" feature not available in this browser or SVG is not compatible.';
            this.setAnswer("Browser did not support SVG.");
            return answerNode;
        }

        this.crossImage.setAttributeNS(null, "opacity", 0);

        //Attach event listener to clickable areas.
        const answerElements = this._getAnswerElements();

        for (let i = 0; i < answerElements.length; i++) {
            if (answerElements[i].id === "cross") {
                continue;
            }

            this.answerMap[answerElements[i].id] = answerElements[i];
            answerElements[i].addEventListener("click", (event) => {
                this.setAnswer(event.target.id);
                this.applyAnswerToUI();
            });
        }

        answerNode.appendChild(this.scaleImage);
        return answerNode;
    }

    /**
    Setup this.scaleImage by definining the content and the viewbox.
    1. this.scaleImage.innerHTML = "<svg...>";
    2. this.scaleImage.setAttribute("viewBox", "0 2 136.76 21.39");
    */
    _setupSVG() {
        TheFragebogen.logger.error(this.constructor.name + "._setupSVG()", "Must be overridden.");
    }

    /**
    Returns all clickable elements representing an answer.
    Every element must have a unique id, which is used as answer.
    @returns {array}
    */
    _getAnswerElements() {
        TheFragebogen.logger.error(this.constructor.name + "._answerElements()", "Must be overridden.");
        return [];
    }

    applyAnswerToUI() {
        if (!this.isUIcreated()) {
            return;
        }

        if (this.getAnswer() === null) {
            this.crossImage.setAttributeNS(null, "opacity", 0);
            return;
        }
        if (this.answerMap[this.getAnswer()] === undefined) {
            TheFragebogen.logger.error(this.constructor.name + ".applyAnswerToUI()", "Invalid answer provided: " + this.getAnswer());
            return;
        }

        //Displays cross
        this.crossImage.setAttributeNS(null, "opacity", 1);

        //Reset previous transforms.
        this.crossImage.setAttributeNS(null, "transform", "translate(0,0)");

        //Move to new position.
        const answer = this.answerMap[this.getAnswer()];
        const crossBBox = this.crossImage.getBBox();
        const answerBBox = answer.getBBox();

        const transform = answer.getScreenCTM().inverse().multiply(this.crossImage.getScreenCTM());
        const translateX = -transform.e + Math.abs(answerBBox.x - crossBBox.x) - crossBBox.width / 2 + answerBBox.width / 2;

        TheFragebogen.logger.debug(this.constructor.name + ".applyAnswerToUI()", translateX);
        this.crossImage.setAttributeNS(null, "transform", "translate(" + translateX + ",0)");
    }

    releaseUI() {
        super.releaseUI();

        this.scaleImage = null;
        this.answerMap = {};
        this.crossImage = null;
    }

    getAnswerOptions() {
        TheFragebogen.logger.warn(this.constructor.name + ".getAnswerOptions()", "Should be overriden.");
        return super.getAnswerOptions();
    }
}
