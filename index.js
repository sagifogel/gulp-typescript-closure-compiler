module.exports = (function () {
    var fs = require("fs");
    var path = require("path");
    var stream = require("stream");
    var gutil = require("gulp-util");
    var Project = require("./project");
    var PluginError = gutil.PluginError;
    var Compiler = require("./compiler");
    var normalizePath = require("normalize-path");
    var PLUGIN_NAME = "gulp-typescript-closure-compiler";
    
    function CompilationStream(compilationOptions, pluginOptions) {
        stream.Transform.call(this, { objectMode: true });
        this.fileList_ = [];
        pluginOptions = pluginOptions || {};
        this.compilationOptions = compilationOptions;
        this.logger_ = pluginOptions.logger || gutil.log;
        this.PLUGIN_NAME_ = pluginOptions.pluginName || PLUGIN_NAME;
        
        if (compilationOptions instanceof Project) {
            var project = compilationOptions;
            this.compilationOptions = { project: compilationOptions.path };
            compilationOptions = compilationOptions.compilerOptions;
            
            if (!project.isValid()) {
                this.emit("error", new PluginError(this.PLUGIN_NAME_, "Compilation error: \n" + project.error));
            }
        }
        else {
            this.compilationOptions = compilationOptions;
            this.compilationOptions.entry = tryNormalizePath(this.compilationOptions.entry);
        }
        
        if (this.compilationOptions.externs) {
            this.externs = this.compilationOptions.externs.map(function (extern) { return tryNormalizePath(extern); });
        }
        
        this.externsOutFile = tryNormalizePath(this.compilationOptions.externsOutFile);
        this.outFile = tryNormalizePath(compilationOptions.outFile || compilationOptions.out);
    }
    
    CompilationStream.prototype = Object.create(stream.Transform.prototype);
    
    CompilationStream.prototype._transform = function (file, enc, cb) {
        if (file.isNull()) {
            cb();
            return;
        }
        
        if (file.isStream()) {
            this.emit("error", new PluginError(this.PLUGIN_NAME_, "Streaming not supported"));
            cb();
            return;
        }
        
        this.fileList_.push(file);
        cb();
    };
    
    CompilationStream.prototype._flush = function (cb) {
        var inputFiles, jsonFiles, logger = this.logger_.warn ? this.logger_.warn : this.logger_;
        
        if (this.fileList_.length > 0) {
            jsonFiles = this.fileList_;
        }
        
        if (!this.compilationOptions.project) {
            inputFiles = jsonFiles;
        }
        
        var stdOutData = "", stdErrData = "";
        var compiler = new Compiler(this.compilationOptions, inputFiles, this.externs);
        var compilerProcess = compiler.run();
        
        compilerProcess.stdout.on("data", function (data) {
            stdOutData += data;
        });
        compilerProcess.stderr.on("data", function (data) {
            stdErrData += data;
        });
        compilerProcess.on("close", (function (code) {
            var me = this;
            var buildFile = function (file) {
                var filePath;
                
                if (!this.outFile && this.compilationOptions.outDir) {
                    filePath = path.resolve(this.compilationOptions.outDir, path.basename(file.path));
                }
                else {
                    filePath = file.path;
                }
                
                filePath = filePath.replace(path.extname(file.path), ".js");
                
                if (fs.existsSync(filePath)) {
                    this.push(new gutil.File({
                        path: filePath,
                        contents: new Buffer(fs.readFileSync(filePath, "utf8"))
                    }));
                }
            }.bind(this);
            
            if (code !== 0) {
                if (stdErrData) {
                    this.emit("error", new PluginError(this.PLUGIN_NAME_, "Compilation error: " + stdErrData));
                }
                else if (stdOutData) {
                    logger(gutil.colors.yellow(this.PLUGIN_NAME_) + " Compilation error:\n" + stdOutData.trim());
                }
                
                return cb();
            }
            
            if (stdOutData.trim().length > 0) {
                logger(gutil.colors.green(this.PLUGIN_NAME_) + ":\n" + stdOutData.trim());
                
                if (!this.outFile) {
                    this.fileList_.forEach(buildFile);
                }
                else {
                    buildFile({ path: this.outFile });
                }
                
                if (this.externsOutFile && this.externsOutFile.length) {
                    if (!this.externsOutFile) {
                        this.externs.map(function (file) { return { path : file.replace(".d", "") }; }).forEach(buildFile);
                    }
                    else {
                        buildFile({ path: this.externsOutFile });
                    }
                }
            }
            cb();
        }).bind(this));
        
        compilerProcess.on("error", (function (err) {
            this.emit("error", new PluginError(this.PLUGIN_NAME_, "Process spawn error. Is tscc in the path?\n" + err.message));
            cb();
        }).bind(this));
        
        compilerProcess.stdin.on("error", (function (err) {
            this.emit("Error", new PluginError(this.PLUGIN_NAME_, "Error writing to stdin of the compiler.\n" + err.message));
            cb();
        }).bind(this));
        
        var stdInStream = new stream.Readable({ read: function () { } });
        stdInStream.pipe(compilerProcess.stdin);
    };
    
    function tryNormalizePath(filePath) {
        if (filePath && !path.isAbsolute(filePath)) {
            return path.resolve(process.cwd(), filePath);
        }
        
        return filePath;
    }
    
    
    function compile(compilationOptions, pluginOptions) {
        return new CompilationStream(compilationOptions, pluginOptions);
    };
    
    compile.createProject = function (path) {
        return new Project(path);
    };
    
    return compile;
})();
