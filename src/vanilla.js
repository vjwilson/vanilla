
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

    //replace the current this.elements
    //with a new collection created by running
    //`querySelectorAll()` from each item in collection
    // and looking for the specified selector
    $v.fn.find = function(str) {
        //store current collection
        var elements = this.elements;

        //reset this.elements to empty Array
        this.elements = [];

        //iterate through current collection
        elements.forEach(function(item) {
            //add the result of `.querySelectorAll()` for the selector
            //to the this.elements Array
            this.elements = this.elements.concat(
                [].slice.call(item.querySelectorAll(str))
            );
        }, this);

        //return reference to $v object for method chaining
        return this;
    };

    //method for getting/setting an attribute's value
    $v.fn.attr = function(attribute, value) {
        //if value was provided
        if(typeof value !== 'undefined') {
            //iterate through collection of elements
            this.elements.forEach(function(item, index, array) {
                //if the value being passed is null, we want to remove the attribute
                if(value === null) {
                    array[index].removeAttribute(attribute);
                //if the value isn't null, we want to set the attribute
                } else {
                    array[index].setAttribute(attribute, value);
                }
            }, this);

            //return reference to `$v` for method chaining
            return this;
        //if value wasn't provided return value
        //getter version of this method not eligible for method chaining
        } else {
            //if attribute name was provided
            if(typeof attribute !== 'undefined') {
                //return value of `attribute` for first item in collection
                return this.elements[0].getAttribute(attribute);
            }
        }
    };

    //method for getting/setting a boolean attribute's value
    $v.fn.prop = function(attribute, value) {
        //if value was provided
        if(typeof value !== 'undefined') {
            //make sure we're dealing with a Boolean
            value = !!value;

            //iterate through collection of elements
            this.elements.forEach(function(item, index, array) {
                //if the value being passed is null, remove the attribute
                if(value === null) {
                    array[index].removeAttribute(attribute);
                //if the value isn't null, we want to set the attribute
                } else {
                    array[index].attribute = value;
                }
            }, this);

            //return reference to `$v` for method chaining
            return this;
        //if value wasn't provided return the actual value
        //getter version of this method not eligible for method chaining
        } else {
            //if attribute name was provided
            if(typeof attribute !== 'undefined') {
                //return boolean value of `attribute` for first item in collection
                return !!this.elements[0][attribute];
            }
        }
    };

    //method for getting/setting a `data-` atrribute's value
    //set or retrieve a data-* attribute value
    $v.fn.data = function(attribute, value) {
        //make sure an attribute name was passed
        if(typeof attribute !== 'undefined') {
            //by default we'll want to prepend "data-"
            var prepend = true;

            //if the attribute name already starts with "data-"
            if(attribute && attribute.indexOf('data-') === 0) {
                prepend = false;
            }

            //call the .attr() method and make
            //sure we prepend "data-" to attribute if needed
            return this.attr(
                (prepend) ? 'data-' + attribute : attribute,
                value
            );
        //no attribute provided, skip it
        } else {
            //return reference to $v for method chaining
            return this;
        }
    }

    //What if we wanted to use convenience methods for other namespaced attributes, like "aria-" attributes?

    //method for extending an object with any other number of objects
    //the first object provided will be used as a container object, to prevent mutation, pass an empty object `{}` as your container object
    //this method returns an object and is not eligible for any method chaining
      $v.extend = function() {
          //initialize empty array to store references to objects
          //currently in the  `arguments` Array-like Object
          var objs = [];

          //by default we'll use a shallow merge
          var deep = false;

          //iterate through our arguments Array-like object
          for(var a = 0; a < arguments.length; a++) {
              //add each argument to our `objs` array
              objs[a] = arguments[a];
          }

          if(typeof objs[0] === 'boolean') {
              deep = objs.shift();
          }

          //take the first object from the arguments
          //store it as our container
          //remove it from the array using `Array.prototype.shift()`
          var container = objs.shift();

          //iterate through the rest of our argument objects
          objs.forEach(function(item) {
              //iterate through properties in item object
              for(var prop in item) {
                  //make sure this is an enumerable property
                  if(item.hasOwnProperty(prop)) {
                    //if this isn't a deep merge
                    if(!deep) {
                      //set container object's `prop`
                      //to the value of extension object's `prop`
                      container[prop] = item[prop];
                    //we need to go deep
                    } else {
                      //check for enumerable property container object
                      if(container.hasOwnProperty(prop)) {
                          //if this property is an object
                          if(typeof item[prop] === 'object') {
                              //recursive deep merge
                              container[prop] = $v.extend(
                                  deep,
                                  (container[prop]) ? container[prop] : {},
                                  item[prop]
                              );
                          //otherwise, set the container object's property
                          } else {
                              container[prop] = item[prop];
                          }
                      //if property didn't exist on container
                      } else {
                          //define new property on container with property's value
                          Object.defineProperty(container, prop, {
                              value: item[prop],
                              writable: true,
                              enumerable: true,
                              configurable: true
                          });
                      }
                    }
                  }
              }
          }, this);

          //return the merged objects as a single object
          return container;
      };
