/**
Provides a UI for pagination between `Screens`.
Only provides a set of API that must be implemented by childs.

@abstract
@class PaginateUI

@param {string} [className] CSS class
*/
function PaginateUI(className) {
    this.className = className;

    this.paginateCallback = null;
}
PaginateUI.prototype.constructor = PaginateUI;
/**
Creates the UI of the element.
@return {object}
@abstract
*/
PaginateUI.prototype.createUI = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".createUI()", "This method must be overridden.");
};
/**
Destroys the UI.
@abstract
*/
PaginateUI.prototype.releaseUI = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".releaseUI()", "This method might need to be overridden.");
};
/**
Sets callback to get informed when loading of all required external data is finished.
@param {Function}
@return {boolean}
*/
PaginateUI.prototype.setPaginateCallback = function(paginateCallback) {
    if (!(paginateCallback instanceof Function)) {
        TheFragebogen.logger.error(this.constructor.name + ".setPaginateCallback()", "No callback handle given.");
        return false;
    }

    TheFragebogen.logger.debug(this.constructor.name + ".setPaginateCallback()", "called");
    this.paginateCallback = paginateCallback;
    return true;
};
/**
Sends this.paginateCallback() to paginate to the desired Screen.
@param {Number} relativeScreenId The screen to paginate to as relative index.
@return {boolean}
*/
PaginateUI.prototype._sendPaginateCallback = function(relativeScreenId) {
    if (!(this.paginateCallback instanceof Function)) {
        TheFragebogen.logger.warn(this.constructor.name + "._sendPaginateCallback()", "called, but no paginateCallback set.");
        return false;
    }
    this.paginateCallback(relativeScreenId);
};
/**
@return {string} Returns a string representation of this object.
@abstract
*/
PaginateUI.prototype.toString = function() {
    TheFragebogen.logger.debug(this.constructor.name + ".toString()", "This method might need to be overridden.");
};
