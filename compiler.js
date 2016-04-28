var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
var compilerPath = require.resolve("../typescript-closure-compiler/tscc");

function Compiler(args, files) {
    this.commandArguments = ["node", compilerPath];
    
    if (files) {
        files.forEach(function (file) {
            this.commandArguments.push(file.path);
        }, this);
    }
    
    if (Array.isArray(args)) {
        this.commandArguments = this.commandArguments.concat(args.slice());
    } 
    else {
        for (var key in args) {
            this.commandArguments.push(this.formatArgument(key, args[key]));
        }
    }
}

Compiler.prototype.logger = null;
Compiler.prototype.spawnOptions = undefined;

Compiler.prototype.run = function () {
    var commnad = this.getFullCommand();
    
    if (this.logger) {
        this.logger(commnad + "\n");
    }
    
    return exec(commnad);
};

Compiler.prototype.getFullCommand = function () {
    return this.commandArguments.join(" ");
};

Compiler.prototype.prependFullCommand = function (msg) {
    return this.getFullCommand() + "\n\n" + msg + "\n\n";
};

Compiler.prototype.formatArgument = function (key, val) {
    if (!val) {
        return "";
    }
    
    return "--" + key + " " + val;
};

module.exports = Compiler;
