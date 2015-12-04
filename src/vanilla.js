
    /**
        Vanilla

        A basic JavaScript Library that will mimic some jQuery funcitonality
        and allow us to explore some of the ways that jQuery achieves things
        as well as illustrating places where we really might not need jQuery
        to perform certain actions.
    */

    //this will be the basis of our library, much like jQuery's `jQuery` function (often aliased as `$`)
    var $v = function(selector) {
        //if this constructor was called without the `new` keyword, we should do that
        if(this === window) {
            return new $v(selector);
        }

        //instead of a complicated selector engine like Sizzle, we'll just be relying on `document.querySelectorAll()`
        //we are using `[].slice.call()` to turn the Array-like list of HTML Nodes into an actual array that we can use native Array methods on
        this.elements = [].slice.call(document.querySelectorAll(selector));

        //return reference to this object
        return this;
    };

    //set up our prototype and alias it is `$v.fn` much like jQuery has `jQuery.fn` (often aliased as `$.fn`)
    $v.fn = $v.prototype = {};

    //set up a property of our prototype for storing utility and convenience methods
    //some of these will seem extraneous, but it will help us have `DRY`er code
    $v.fn.utils = {};

    //method for adding a class to elements in collection
    //1: What if we want the user to be able to pass in as many classes as they want?
    //2: What if we want the user to be able to pass multiple classes in a single parameter?
    //3: What if we want the user to be able to do both 1 and 2 above?
    $v.fn.addClass = function(classString) {

        // iterate through arguments lists
        var classes = [];

        for (var i = 0, total = arguments.length; i < total; i++) {
            classes.push(arguments[i]);
        }

        // iterate through this.elements
        this.elements.forEach(function(element, index, array) {
            classes.forEach(function(classString) {
                if (!(this.hasClass(classString, element))) {
                    // add class to element's class property
                    array[index].className += ' ' + classString;
                }
            }, this);
        }, this);

        //return reference to `$v` for method chaining
        return this;
    };

    //method for removing a class from elements in collection
    //1: What if we want the user to be able to pass in as many classes as they want?
    //2: What if we want the user to be able to pass multiple classes in a single parameter?
    //3: What if we want the user to be able to do both 1 and 2 above?
    $v.fn.removeClass = function(classString) {
        //remove class logic here
    };

    //method for toggling a class on elements in collection
    //1: What if we want the user to be able to pass in as many classes as they want?
    //2: What if we want the user to be able to pass multiple classes in a single parameter?
    //3: What if we want the user to be able to do both 1 and 2 above?
    $v.fn.toggleClass = function(classString) {
        //toggle class logic here
    };

    //check to see if element has given class
    $v.fn.hasClass = function(classString, element) {
        //if an element was passed to the method
        if(element) {
            //if this class exists in the element's className property
            if(element.className.indexOf(classString) !== -1) {
                return true;
            }

            //by default, let's assume it doesn't
            return false;
        }

        //if no element parameter was passed to the method
        //use the first item in our collection
        if(this.elements[0].className.indexOf(classString) !== -1) {
            return true;
        }

        //again, let's assume this doesn't have the class
        return false;
    };
