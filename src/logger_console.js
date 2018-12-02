/**
Defines a message that should be logged, consisting of level, location, and the content.
The messages _should_ be subdivided in five types according to their relevance:
1. Fatal
2. Error
3. Warn
4. Info
5. Debug

DEVELOPER: This class is used internally by LogConsole and should not be accessed directly.

@class LogMessage

@param {string} logLevel type of message
@param {string} location location in the code
@param {string} msg the message itself
*/
function LogMessage(logLevel, location, msg) {
    this.logLevel = "" + logLevel;
    this.location = "" + location;
    this.msg = msg;
}

/**
Provides basic logging functionality (prints to console).

DEVELOPER: All the messages (instances of class `LogMessage`) are saved in an array and can be accessed via `TheFragebogen.logger.logMessages` as long as this logger is used.
@class LogConsole
*/
function LogConsole() {
    this.logMessages = [];
    this.debug("LogConsole.constructor()", "Start");
}

LogConsole.prototype.debug = function(location, msg) {
    this.logMessages.push(new LogMessage("DEBUG", location, msg));
    if (console.debug === undefined) {
        //For IE console.debug is not defined.
        console.debug = console.log;
    }
    console.debug("DEBUG: " + location + ": " + msg);
};

LogConsole.prototype.info = function(location, msg) {
    this.logMessages.push(new LogMessage("INFO", location, msg));
    console.info("INFO: " + location + ": " + msg);
};

LogConsole.prototype.warn = function(location, msg) {
    this.logMessages.push(new LogMessage("WARN", location, msg));
    console.warn("WARN: " + location + ": " + msg);
};

LogConsole.prototype.error = function(location, msg) {
    this.logMessages.push(new LogMessage("ERROR", location, msg));
    console.error("ERROR: " + location + ": " + msg);
};

LogConsole.prototype.fatal = function(location, msg) {
    this.logMessages.push(new LogMessage("FATAL", location, msg));
    console.error("FATAL: " + location + ": " + msg);
};

/**
 Defines the accessor for the logger.
 Can be redefined later if desired.
*/
TheFragebogen = {
    logger: new LogConsole()
};
