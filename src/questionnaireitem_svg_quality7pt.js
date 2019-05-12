/**
A QuestionnaireItem presenting the 7pt Quality scale as defined in ITU-T P.851 p. 19.
Labels are by default in German - the content of the labels is defined in the SVG.

@class QuestionnaireItemSVGQuality7pt
@augments UIElement
@augments UIElementInteractive
@augments QuestionnaireItem
@augments QuestionnaireItemSVG
*/
class QuestionnaireItemSVGQuality7pt extends QuestionnaireItemSVG {

    /**
    @param {string} [className] CSS class
    @param {string} question
    @param {boolean} [required=false]
    @param {string[]} [labels=["NOTE: Default labels are defined in the SVG."]] The labels (7 items; evaluated to string)
    */
    constructor(className, question, required, labels) {
        super(className, question, required);

        this.labels = labels;
    }

    _setupSVG() {
        this.scaleImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.scaleImage.setAttribute("viewBox", "0 2 136.76 21.39");
        this.scaleImage.innerHTML = '@@include("../svg_scales/quality7pt_scale_include.svg")';

        if (this.labels instanceof Array && this.labels.length === 7) {
            TheFragebogen.logger.debug(this.constructor.name + "._setupSVG()", "Using custom labels: " + this.labels);

            this.scaleImage.getElementById("label10").textContent = this.labels[0];
            this.scaleImage.getElementById("label20").textContent = this.labels[1];
            this.scaleImage.getElementById("label30").textContent = this.labels[2];
            this.scaleImage.getElementById("label40").textContent = this.labels[3];
            this.scaleImage.getElementById("label50").textContent = this.labels[4];
            this.scaleImage.getElementById("label60").textContent = this.labels[5];
            this.scaleImage.getElementById("label70").textContent = this.labels[6];
        } else {
            TheFragebogen.logger.info(this.constructor.name + "._setupSVG()", "Using default scale labels.");
        }
    }

    _getAnswerElements() {
        return this.scaleImage.getElementsByTagName("ellipse");
    }

    getAnswerOptions() {
        return "10-70";
    }
}
