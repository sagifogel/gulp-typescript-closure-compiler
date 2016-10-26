gulp-typescript-closure-compiler
===============
A gulp plugin for handling [typescript-closure-compiler](https://github.com/sagifogel/typescript-closure-compiler) compilation.<br/>
The current version is compatible with `typescript-closure-compiler 1.8`.<br/>
For the purposes of clarity each npm package that will be released will match the major and minor version of `typescript-closure-compiler`.<br/>
For example each version of `gulp-typescript-closure-compiler` that is compatible with `typescript-closure-compiler 1.7` will be constructed also 1.7.x and each version that is compatible with `typescript-closure-compiler 1.8` will be constructed as 1.8.x<br/>

## Installing

For the latest stable version:

```js
npm install gulp-typescript-closure-compiler
```
or use it in the dependencies/devDependencies section of your package.json

```js
 "dependencies": {
    "gulp-typescript-closure-compiler": "1.8.x"
}
```
 Installing the latest version  means that `gulp-typescript-closure-compiler` will be dependent upon the latest version of `typescript-closure-compiler 1.8` <br/><br/>
If you work with a specific version of typescript-closure-compiler (for instance 1.7), <br/>Then you need to install it globally using the @{version} after the `gulp-typescript-closure-compiler` name:<br/>
```js
npm install -g gulp-typescript-closure-compiler@1.7.x
```
or use it in the dependencies/devDependencies section of your package.json

```js
 "dependencies": {
    "gulp-typescript-closure-compiler": "1.7.x"
}
```
Basic Usage
----------
Import the library
```javascript
var tscc = require("gulp-typescript-closure-compiler");
``` 
create the gulp-typescript-closure-compiler task 

```javascript
gulp.task('build-source', function () {
    return gulp.src(['src/**/*.ts'])
               .pipe(tscc({
                    exportAs: "App",
                    module: "commonjs",
                    entry: "src/app.ts",
                    noEmitOnError: true,
                    removeComments: true,
                    outFile: "built/output.js",
                    externsOutFile : "externs.js",
                    externs: [
                        "externs/app-externs.d.ts"
                    ]
                }));
});
```
Invoke the task 
```javascript
gulp build-source
```
This example will compile all TypeScript files in folder `src` to a single closure compiler ready output file called `output.js` in `built` folder.

Using `tsconfig.json`
-------------
Import the library
```javascript
var tscc = require("gulp-typescript-closure-compiler");
```
To use `tsconfig.json`, you have to use `tscc.createProject`:

```javascript
var project = tscc.createProject(__dirname); //a directory containing a tsconfig.json 
```
create the gulp-typescript-closure-compiler task
```javascript
gulp.task('build-project', function () {
    var project = tscc.createProject(__dirname);

    return project.src()
                  .pipe(tscc(project));
});
```
Invoke the task 
```javascript
gulp build-project
```

## Usage Examples

See an example using `gulp-typescript-closure-compiler` plugin in the [TSFunq](https://github.com/sagifogel/TSFunq) project.

License
-------
gulp-typescript-closure-compiler is licensed under the [MIT license](http://opensource.org/licenses/MIT).
