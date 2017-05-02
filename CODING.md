TheFragebogen: Coding Guidelines
===

Here the coding guidelines for [TheFragebogen](http://www.thefragebogen.de) are described.  
While writing code please keep in mind that _source code_ is a communication tool not between you and a computer.  
Actually, _source code_ is a communication between you and other people (including you) that need to understand the source code after you have written / modified it.

General
---

1. Please read this document completely.
2. Write code for people, not for computers.
3. Always check the code for _warnings_ and fix them.
4. Always format the code.
5. Parameter: check types, ranges and provide _useful_ feedback.
6. Provide _useful_ debug/warning/error messages.
7. Implement tests for everything possible. And use them: `grunt test`.
8. Work [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming) (but don't overuse it).

Programming style
---

1. TheFragebogen is implemented [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming).

2. TheFragebogen is documented using JSDoc.
Documentation can be build using `grunt doc`.

3. Software tests are implemented using [QUnit](https://qunitjs.com/).
Tests can be started using `grunt test` or opening the individual files in `tests/`.

JavaScript with Style
---
1. Always use `===` instead of `==`.

   JavaScript is a non-typed language and this applies a typewise comparison: `1 === "1"` is false.

2. Always initialize variables with `null` and never with `undefined`.

   `null` means that the variable was declared but has no value, whereas `undefined` indicates that the variable was not declared.

3. Usage of `instanceof` versus `typeof`

   Use `typeof` for _built-in primitive data types_, such as numbers: `typeof(4) === "number"`.

   Use `instanceof` to compare if an _object_ is an instance of a _class_: `new Number(4) instanceof Number`.

4. (DOM-Objects) use `element.attribute = value` instead of `element.setAttribute(attribute, value)`.

   This form is shorter and easier to read.

5. Try to avoid array magic.

   JavaScript provides functional methods (e.g., [`array.map()`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/map)).

   Use them if appropriate, but avoid stacking them - it gets hard to understand.

6. Private methods of a class start with an underscore (e.g., `this._createUI()`)

   Although this is not enforced by JavaScript, please respect it - if something is marked as private somebody had a reason to do so.

7. `typeof` always returns a `string`: `(typeof(undefined) === "undefined")` => `true`

   This statement is `true` while `typeof(undefined) === undefined` evaluates to `false`.

Formatting
---

For formatting, a Grunt task is provided: `grunt format`

It applies [js-beautify](https://github.com/beautify-web/js-beautify) via [grunt-jsbeautifier](https://www.npmjs.com/package/grunt-jsbeautifier) on all JavaScript/HTML/CSS files (incl. configuration files).

Documentation
---

Documentation is generated using [JSDoc](http://usejsdoc.org/).

Please add appropriate documentation to all functions and methods that are not _simple_.

Class structure
---

The build process (`grunt`) uses [JSDoc](http://usejsdoc.org/) tags to derive the class structure (i.e., inheritance) and concatenates the individual files in the correct order.  
For this, a modified version of the [Grunt](http://gruntjs.com/) plugin [concat_in_order](https://www.npmjs.com/package/grunt-concat-in-order) is used (see folder _third-party_).

All class are thus required to provide the `@class` annotation as well as `@augments` for every super class, so the correct order of concatenation can be derived.
