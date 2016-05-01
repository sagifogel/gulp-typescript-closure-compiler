gulp-typescript-closure-compiler
===============
A gulp plugin for handling [typescript-closure-compiler](https://github.com/sagifogel/typescript-closure-compiler) compilation.

## Installing

For the latest stable version:

```js
npm install gulp-typescript-closure-compiler
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
            outFile: "built/output.js"
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

License
-------
gulp-typescript-closure-compiler is licensed under the [MIT license](http://opensource.org/licenses/MIT).