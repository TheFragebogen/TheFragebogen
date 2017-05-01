/**
A QuestionnaireItem presenting the 7pt Quality scale as defined in ITU-T P.851 p. 19.

@class QuestionnaireItemSVGQuality7pt
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSVG

@param {string} [className] CSS class
@param {string} question
@param {boolean} [required=false]
*/
function QuestionnaireItemSVGQuality7pt(className, question, required) {
    QuestionnaireItemSVG.call(this, className, question, required);
}
QuestionnaireItemSVGQuality7pt.prototype = Object.create(QuestionnaireItemSVG.prototype);
QuestionnaireItemSVGQuality7pt.prototype.constructor = QuestionnaireItemSVGQuality7pt;
QuestionnaireItemSVGQuality7pt.prototype._setupSVG = function() {
    this.scaleImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.scaleImage.setAttribute("viewBox", "0 2 136.76 21.39");
    this.scaleImage.innerHTML = '@@include("../svg_scales/quality7pt_scale_include.svg")';
};
QuestionnaireItemSVGQuality7pt.prototype._getAnswerElements = function() {
    return this.scaleImage.getElementsByTagName("ellipse");
};
QuestionnaireItemSVGQuality7pt.prototype.getAnswerOptions = function() {
    return "10-70";
};
