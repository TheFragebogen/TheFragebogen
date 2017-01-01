/**
A QuestionnaireItem presenting the 7pt Quality scale as defined in ITU-T P.851 p. 19.

@class QuestionnaireItemQuality7pt

@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem

@param {string} [className] CSS class
@param {string} question
@param {boolean} [required=false]
*/
function QuestionnaireItemQuality7pt(className, question, required) {
    QuestionnaireItemSVG.call(this, className, question, required);
}
QuestionnaireItemQuality7pt.prototype = Object.create(QuestionnaireItemSVG.prototype);
QuestionnaireItemQuality7pt.prototype.constructor = QuestionnaireItemQuality7pt;
QuestionnaireItemQuality7pt.prototype._setupSVG = function() {
    this.scaleImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.scaleImage.setAttribute("viewBox", "0 2 136.76 21.39");
    this.scaleImage.innerHTML = '@@include("../svg_scales/quality7pt_scale_include.svg")';
};
QuestionnaireItemQuality7pt.prototype._getAnswerElements = function() {
    return this.scaleImage.getElementsByTagName("ellipse");
};
QuestionnaireItemQuality7pt.prototype.getAnswerOptions = function() {
    return "10-70";
};
