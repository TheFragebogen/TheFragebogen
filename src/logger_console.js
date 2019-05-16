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
*/
class LogMessage {

    /**
    @param {string} logLevel type of message
    @param {string} location location in the code
    @param {string} msg the message itself
    */
    constructor(logLevel, location, msg) {
        this.logLevel = "" + logLevel;
        this.location = "" + location;
        this.msg = msg;
    }
}

/**
Provides basic logging functionality (prints to console).

DEVELOPER: All the messages (instances of class `LogMessage`) are saved in an array and can be accessed via `TheFragebogen.logger.logMessages` as long as this logger is used.

@class LogConsole
*/
class LogConsole {

    constructor() {
        this.logMessages = [];
        this.debug("LogConsole.constructor()", "Start");
    }

    debug(location, msg) {
        this.logMessages.push(new LogMessage("DEBUG", location, msg));
        if (console.debug === undefined) {
            //For IE console.debug is not defined.
            console.debug = console.log;
        }
        console.debug("DEBUG: " + location + ": " + msg);
    }

    info(location, msg) {
        this.logMessages.push(new LogMessage("INFO", location, msg));
        console.info("INFO: " + location + ": " + msg);
    }

    warn(location, msg) {
        this.logMessages.push(new LogMessage("WARN", location, msg));
        console.warn("WARN: " + location + ": " + msg);
    }

    error(location, msg) {
        this.logMessages.push(new LogMessage("ERROR", location, msg));
        console.error("ERROR: " + location + ": " + msg);
    }

    fatal(location, msg) {
        this.logMessages.push(new LogMessage("FATAL", location, msg));
        console.error("FATAL: " + location + ": " + msg);
    }
}

/**
 Defines the accessor for the logger.
 Can be redefined later if desired.
*/
const TheFragebogen = {
    logger: new LogConsole()
};
