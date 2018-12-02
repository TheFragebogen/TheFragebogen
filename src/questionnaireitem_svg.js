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
var cross=document.getElementById("cross")
var answerA = document.getElementById('10'); //Change if you use different answer

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

@param {string} [className] CSS class
@param {string} question
@param {boolean} [required=false]
*/
function QuestionnaireItemSVG(className, question, required) {
    QuestionnaireItem.call(this, className, question, required);

    this.scaleImage = null;
    this.answerMap = null;
    this.crossImage = null;
}
QuestionnaireItemSVG.prototype = Object.create(QuestionnaireItem.prototype);
QuestionnaireItemSVG.prototype.constructor = QuestionnaireItemSVG;

QuestionnaireItemSVG.prototype._createAnswerNode = function() {
    var node = document.createElement("div");

    this.scaleImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._setupSVG();

    this.crossImage = this.scaleImage.getElementById("cross");
    //Problem identified here by the tests while using Safari 7.0.6 --- this.crossImage === null
    if (this.crossImage === null) {
        node.innerHTML = '"QuestionnaireItemSVG" feature not available in this browser or SVG is not compatible.';
        this.answer = "unavailable"; //sets answer, so the item will be ready even if it was required.
        return node;
    }

    this.crossImage.setAttributeNS(null, "opacity", 0);

    //Attach event listener to clickable areas.
    this.answerMap = {};
    var answerElements = this._getAnswerElements();

    for (var i = 0; i < answerElements.length; i++) {
        if (answerElements[i].id === "cross") {
            continue;
        }

        this.answerMap[answerElements[i].id] = answerElements[i];
        answerElements[i].onclick = (this._handleChange).bind(this);
    }

    if (this.answer !== null) {
        this._updateUI();
    }

    node.appendChild(this.scaleImage);
    return node;
};
/**
Setup this.scaleImage by definining the content and the viewbox.
1. this.scaleImage.innerHTML = "<svg...>";
2. this.scaleImage.setAttribute("viewBox", "0 2 136.76 21.39");
*/
QuestionnaireItemSVG.prototype._setupSVG = function() {
    TheFragebogen.logger.error(this.constructor.name + "._setupSVG()", "Must be overridden.");
};
/**
Returns all clickable elements representing an answer.
Every element must have a unique id, which is used as answer.
@returns {array}
*/
QuestionnaireItemSVG.prototype._getAnswerElements = function() {
    TheFragebogen.logger.error(this.constructor.name + "._answerElements()", "Must be overridden.");
    return [];
};

QuestionnaireItemSVG.prototype._handleChange = function(event) {
    if (!this.isEnabled()) {
        return;
    }

    this.setAnswer(event.target.id);

    this.markRequired();
    this._sendReadyStateChanged();
};
QuestionnaireItemSVG.prototype._updateUI = function() {
    if (!this.isUIcreated()) {
        return;
    }

    if (this.answer === null) {
        this.crossImage.setAttributeNS(null, "opacity", 0);
        return;
    }
    if (this.answerMap[this.getAnswer()] === undefined) {
        TheFragebogen.logger.error(this.constructor.name + "._updateUI()", "Invalid answer provided: " + this.getAnswer());
        return false;
    }

    //Displays cross
    this.crossImage.setAttributeNS(null, "opacity", 1);

    //Reset previous transforms.
    this.crossImage.setAttributeNS(null, "transform", "translate(0,0)");

    //Move to new position.
    var answer = this.answerMap[this.answer];
    var crossBBox = this.crossImage.getBBox();
    var answerBBox = answer.getBBox();

    var transform = answer.getScreenCTM().inverse().multiply(this.crossImage.getScreenCTM());
    var translateX = -transform.e + Math.abs(answerBBox.x - crossBBox.x) - crossBBox.width / 2 + answerBBox.width / 2;

    TheFragebogen.logger.debug(this.constructor.name + "._updateUI()", translateX);
    this.crossImage.setAttributeNS(null, "transform", "translate(" + translateX + ",0)");
};

QuestionnaireItemSVG.prototype.setAnswer = function(answer) {
    if (answer === null) {
        this.answer = null;
        this._updateUI();
        return true;
    }

    TheFragebogen.logger.info(this.constructor.name + ".setAnswer()", answer);
    this.answer = answer;

    this.markRequired();
    this._sendReadyStateChanged();

    this._updateUI();
    return true;
};

QuestionnaireItemSVG.prototype.releaseUI = function() {
    this.node = null;
    this.uiCreated = false;
    this.enabled = false;

    this.scaleImage = null;
    this.answerMap = null;
    this.crossImage = null;
};

QuestionnaireItemSVG.prototype.getData = function() {
    return [this.getQuestion(), this.getAnswer()];
};

QuestionnaireItemSVG.prototype._checkData = function(data) {
    return data[0] === this.question;
};

QuestionnaireItemSVG.prototype.setData = function(data) {
    if (!this._checkData(data)) {
        return false;
    }

    this.setAnswer(data[1]);
    return true;
};

QuestionnaireItemSVG.prototype.getAnswerOptions = function() {
    TheFragebogen.logger.warn(this.constructor.name + ".getAnswerOptions()", "Should be overriden.");
};
