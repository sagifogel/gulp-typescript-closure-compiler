var fs = require("fs");
var path = require("path");
var vfs = require("vinyl-fs");

function Project(projectPath) {
    try {
        var configFilePath = path.resolve(projectPath, "tsconfig.json");

        if (fs.existsSync(configFilePath)) {
            this.path = projectPath;
            this.absolutePath = configFilePath;
            this.compilerOptions = require(configFilePath).compilerOptions;
            this.valid = true;
        }
        else {
            this.error = "tsconfig.json could not be found";
        }
    }
    catch (e) {
        this.error = "tsconfig.json could not be loaded: " + e.message;
    }
}

Project.prototype.path = null;
Project.prototype.error = null;
Project.prototype.valid = false;
Project.prototype.absolutePath = null;
Project.prototype.compilerOptions = null;

Project.prototype.isValid = function () {
    return this.valid;
};

Project.prototype.src = function () {
    return vfs.src([this.absolutePath])
};

module.exports = Project;