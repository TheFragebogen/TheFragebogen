/**
A QuestionnaireItem presenting a Visual Analogue Scale (100pt).

@class QuestionnaireItemSVGVisualAnalogueScale
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSVG
*/
class QuestionnaireItemSVGVisualAnalogueScale extends QuestionnaireItemSVG {

    /**
    @param {string} [className] CSS class
    @param {string} question
    @param {boolean} [required=false]

    @param {string} [captionRight] The caption of the left label.
    @param {string} [captionLeft] The caption of the right label.
    */
    constructor(className, question, required, captionLeft, captionRight) {
        super(className, question, required);

        this.captionLeft = captionLeft;
        this.captionRight = captionRight;
    }

    _setupSVG() {
        this.scaleImage.setAttribute("viewBox", "0 2 170 19.39");
        this.scaleImage.innerHTML = '@@include("../svg_scales/visual_analogue_scale100pt_include.svg")';

        this.scaleImage.getElementById("labelLeft").textContent = this.captionLeft;
        this.scaleImage.getElementById("labelRight").textContent = this.captionRight;
    }

    _getAnswerElements() {
        return this.scaleImage.getElementsByTagName("ellipse");
    }

    getAnswerOptions(data) {
        return "10-109";
    }
}
