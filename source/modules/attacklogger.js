// attacklogger.js
const fs = require('fs');
function appendToLogFile(message, filePath = "/home/kali/桌面/antSword/logs/logfile.log") {
    const logMessage = `${new Date().toLocaleString()} - ${message}\n`;
    fs.appendFile(filePath, logMessage, (err) => {
        if (err) {
            console.error(`Error appending to log file (${filePath}):`, err);
        }
    });
}

module.exports = {
    appendToLogFile,
};
