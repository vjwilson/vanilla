
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

    //this utility will strip a `.` or `#` from the beginning of a string
    //we'll use it for times when we want an id or class name as a string but the user might have passed us a selector string like `#id` or `.class`
    $v.fn.utils.convertSelectorToString = function(str) {
        var checkCharacter = str[0];

        switch(checkCharacter) {
            case '.':
            case '#':
                return str.substr(1);
            default:
                return str;
        }
    };

    //this utility will take an element and split it's `className` attribute into an array
    $v.fn.utils.getClassList = function(element) {
        return this.convertDelimitedStringToArray(element.className);
    };

    //this utility will take an array of classes and return the joined class list
    $v.fn.utils.createClassList = function(classes) {
        return classes.join(' ');
    };

    //this utility checks to see if an array contains the specified value
    $v.fn.utils.arrayContains = function(array, search, index) {
        //if we are looking for a string, we'll want to trim it just in case there were leftover spaces
        var atIndex = array.indexOf((typeof search === 'string' ? search.trim() : search));

        //if item was found in array
        if(atIndex !== -1) {
            //return the index (if specified) or just a boolean
            return (index ? atIndex : true);
        }

        return (index ? atIndex : false);
    };

    //this utility takes a string and converts it into an array
    //this can be done with a specified delimiter or it will use commas (if present in the string) or spaces
    //it iterates through the array and trims any strings before returning it
    $v.fn.utils.convertDelimitedStringToArray = function(str, delimiter) {
        //declare a variable to store our array of strings
        var items;

        //if a delimiter was provided
        if(typeof delimiter !== 'undefined') {
            items = str.split(delimiter);
        } else {
            items = str.split((str.indexOf(',') !== -1 ? ',' : ' '));
        }

        //iterate through our items array and trim any strings
        //then return the new array
        items.forEach(function(item, index, array) {
            if(typeof item === 'string') {
                array[index] = item.trim();
            }
        });

        return items;
    };

    //this utility will take a node and return an object of it's attributes and values
    $v.fn.utils.generateAttributesObject = function(element, data) {
        //intialize empty object to store our attribute values
        var returnAttrs = {};

        //cache the attribute node list from our element so it's easier to reference
        var elementAttrs = element.attributes;

        //if the data attribute wasn't provided, explicitly set it to false
        if(typeof data === 'undefined') {
            data = false;
        }

        //iterate through our attributes node list
        //we are using a `for()` loop because this node list is an Array-like object and not an actual Array
        for(var i = 0; i < elementAttrs.length; i++) {
            //if we are only looking for data attributes and this is one, or if we aren't only looking for data attributes
            if(data && elementAttrs[i].nodeName.indexOf('data-') === 0 || !data) {
                //add attribute: value pair to our attribute object
                returnAttrs[elementAttrs[i].nodeName] = elementAttrs[i].nodeValue;
            }
        }

        //return our object of attributes
        return returnAttrs;
    };

    //this utility will take a container object and extend it with another object
    //`deep` is a Boolean that tells the utility whether it should copy deeply or not
    $v.fn.utils.mergeObjects = function(container, extendWith, deep) {
        //if we need to do a deep merge, return the deepMergeObjects() utility method
        if(deep) {
            return this.deepMergeObjects(container, extendWith);
        }

        //iterate through properties in `extendWith` object
        for(var prop in extendWith) {
            //make sure this is an enumerable property
            if(extendWith.hasOwnProperty(prop)) {
                //set the value of our container object's property to the value of our extension object's property
                container[prop] = extendWith[prop];
            }
        }

        //return our extended object
        return container;
    };

    //this utility will take a container object and extend it with another object
    //this is a deep copy
    $v.fn.utils.deepMergeObjects = function(container, extendWith) {
        //iterate through properties in `extendWith` object
        for(var prop in extendWith) {
            //check to see if this is an enumerable property of our extension object
            if(extendWith.hasOwnProperty(prop)) {
                //check to see if this is an enumerable proerty of our container object
                //if this property already exists on our container, we will want to treat it a bit differently
                if(container.hasOwnProperty(prop)) {
                    //if this property is an object
                    if(typeof extendWith[prop] === 'object') {
                        //recursively deep merge the object before setting our property's value
                        container[prop] = this.deepMergeObjects((container[prop] ? container[prop] : {}), extendWith[prop]);
                    //otherwise, we'll just set the container object's property to the value of the extension object's property
                    } else {
                        container[prop] = extendWith[prop];
                    }
                //if this property didn't exist on our container
                } else {
                    //define a new property on our container object with this proprety's value from our extension object
                    Object.defineProperty(container, prop, {
                        value: extendWith[prop],
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        }

        //return our extended container object
        return container;
    };

    //replaces the current collection with a new collection created by running `querySelectorAll()` from each item in the collection and looking for
    //a specified selector
    $v.fn.find = function(str) {
        var elements = this.elements;

        this.elements = [];

        elements.forEach(function(item) {
            this.elements = this.elements.concat([].slice.call(item.querySelectorAll(str)));
        }, this);

        return this;
    };

    //method for checking if the items in the current collection have a specified class
    //we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
    //1: We will allow the `hasClass()` method to accept any number of parameters
    //2: We will accept space, or comma-delimited lists of class names for each parameter
    $v.fn.hasClass = function() {
        //initialize variable we'll use if we are looking at a specific element
        var element;

        //declare variable we'll use to store an array of class names
        var classes = [];

        //convert our arguments Array-like object into an actual array we can work with
        for(var a = 0; a < arguments.length; a++) {
            this.utils.convertDelimitedStringToArray(arguments[a]).forEach(function(item) {
                classes.push(item);
            }, this);
        }

        //if the first item in our classes array was an HTML Node
        if(classes[0] && (classes[0].nodeName || classes[0].tagName)) {
            //pull it out of the array and store it in the element variable we initialized above
            element = classes.shift();
        }

        //iterate through the classes we need to check for
        //we are using `.every()` so that we can break out of the loop when the class is not found on an element
        //we return a boolean from this method, so it is not eligible for any chaining after beng called
        return classes.every(function(str) {
            if(!element) {
                //iterate through the elements in our collection
                return this.elements.every(function(item) {
                    if(this.utils.arrayContains(this.utils.getClassList(item), this.utils.convertSelectorToString(str))) {
                        return false;
                    }

                    return true;
                }, this);
            }

            if(this.utils.arrayContains(this.utils.getClassList(element), this.utils.convertSelectorToString(str))) {
                return true;
            }

            return false;
        }, this);
    };

    //method for adding a class to elements in collection
    //we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
    //1: We will allow the `addClass()` method to accept any number of parameters
    //2: We will accept space, or comma-delimited lists of class names for each parameter
    $v.fn.addClass = function() {
        //declare variable we'll use to store an array of class names
        var classes = [];

        //convert our arguments Array-like object into an actual array we can work with
        for(var a = 0; a < arguments.length; a++) {
            this.utils.convertDelimitedStringToArray(arguments[a]).forEach(function(item) {
                classes.push(item);
            }, this);
        }

        //iterate through the classes we need to add
        classes.forEach(function(str) {
            //iterate through the elements in our collection
            this.elements.forEach(function(item, index, array) {
                //check to see if this item already has the class, add it if not
                if(!this.hasClass(item, this.utils.convertSelectorToString(str))) {
                    //get class list
                    //we cache this in it's own variable so we can use it for a push call later on
                    var classList = this.utils.getClassList(item);

                    //add it to the class list
                    classList.push(this.utils.convertSelectorToString(str));

                    array[index].className = this.utils.createClassList(classList);
                }
            }, this);
        }, this);

        //return reference to `$v` for method chaining
        return this;
    };

    //method for removing a class from elements in collection
    //we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
    //1: We will allow the `addClass()` method to accept any number of parameters
    //2: We will accept space, or comma-delimited lists of class names for each parameter
    $v.fn.removeClass = function() {
        //declare variable we'll use to store an array of class names
        var classes = [];

        //convert our arguments Array-like object into an actual array we can work with
        for(var a = 0; a < arguments.length; a++) {
           this.utils.convertDelimitedStringToArray(arguments[a]).forEach(function(item) {
                classes.push(item);
           }, this);
        }

        //iterate through the classes we need to remove
        classes.forEach(function(str) {
            //iterate through the elements in our collection
            this.elements.forEach(function(item, index, array) {
                //check to see if this item already has the class, remove it if so
                if(this.hasClass(item, this.utils.convertSelectorToString(str))) {
                    //get class list
                    //we cache this in it's own variable so we can use it for a push call later on
                    var classList = this.utils.getClassList(item);

                    //check to see if class exists in class list
                    //we cache this in it's own variable so we can use it for a splice call later on
                    var removeIndex = this.utils.arrayContains(classList, this.utils.convertSelectorToString(str), true);

                    //remove it from the class list
                    classList.splice(removeIndex, 1);

                    array[index].className = this.utils.createClassList(classList);
                }
            }, this);
        }, this);

        //return reference to `$v` for method chaining
        return this;
    };

    //method for toggling a class on elements in collection
    //we want the user to be able to pass in as many classes as they want, we'll acheive this in two ways
    //1: We will allow the `addClass()` method to accept any number of parameters
    //2: We will accept space, or comma-delimited lists of class names for each parameter
    $v.fn.toggleClass = function() {
        //declare variable we'll use to store an array of class names
        var classes = [];

        //convert our arguments Array-like object into an actual array we can work with
        for(var a = 0; a < arguments.length; a++) {
            this.utils.convertDelimitedStringToArray(arguments[a]).forEach(function(item) {
                classes.push(item);
            }, this);
        }

        //iterate through the classes we need to check for
        //we are using `.every()` so that we can break out of the loop when the class is not found on an element
        classes.forEach(function(str) {
            this.elements.forEach(function(item, index, array) {
                //get class list
                //we cache this in it's own variable so we can use it for a splice or push call later on
                var classList = this.utils.getClassList(item);

                //check to see if class exists in class list
                //we cache this in it's own variable so we can use it for a splice call later on
                var toggleIndex = this.utils.arrayContains(classList, this.utils.convertSelectorToString(str), true);

                if(toggleIndex === -1) {
                    classList.push(this.utils.convertSelectorToString(str));
                } else {
                    classList.splice(toggleIndex, 1);
                }

                array[index].className = this.utils.createClassList(classList);
            }, this);
        }, this);

        //return reference to `$v` for method chaining
        return this;
    };

    //method for getting/setting an attribute's value
    //if only the attribute parameter is provided, returns the attributes value from the first item in the collection
    //if both parameters are provided, sets the attribute to the provided value for each element in the collection
    //if the value provided is equal to `null`, removes the attribute for each element in the collection
    //if both the attribute and value are omitted, returns value of all attributes from the first item in the collection
    $v.fn.attr = function(attribute, value, data) {
        //if this wasn't called from the `$v.data()` method
        if(typeof data === 'undefined') {
            //explicitly define `data` as false
            data = false;
        }

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
        //if value wasn't provided
        //we return the actual value in this case, so the getter version of this method is not eligible for any method chaining
        } else {
            //if attribute name was provided
            if(typeof attribute !== 'undefined') {
                //return value of `attribute` for first item in collection
                return this.elements[0].getAttribute(attribute);
            //if no attribute was provided
            } else {
                //return values of all attributes for first item in collection
                return this.utils.generateAttributesObject(this.elements[0], data);
            }
        }
    };

    //method for getting/setting a `data-` atrribute's value
    //calls the `$v.attr()` method, but prepends "data-" to the attribute name if necessary
    //will return all data attributes when called without either parameter
    $v.fn.data = function(attribute, value) {
        //return the result of `$v.attr()` with "data-" prepended to the provided attribute name
        return this.attr((attribute && attribute.indexOf('data-') !== 0 ? 'data-' + attribute : attribute), value, true);
    };

    //method for extending an object with any other number of objects
    //if the first parameter is a boolean and is true, it means we want to deeply merge the objects
    //the first object provided will be used as a container object, to prevent mutation, pass an empty object `{}` as your container
    //we aren't defining any parameters explicitly because the parameters are fluid in this case
    //this method returns an object and is not eligible for any method chaining
    $v.extend = function() {
        //initialize empty array to store references to our objects that are currently in the  `arguments` object
        var objs = [];

        //initialize a boolean for whether we want to do a deep merge or not
        //this method performs a shallow merge by default
        var deep = false;

        //iterate through our arguments Array-like object
        for(var a = 0; a < arguments.length; a++) {
            //add each argument to our `objs` array
            objs[a] = arguments[a];
        }

        //if the first argument was a boolean
        if(typeof objs[0] === 'boolean') {
            //we'll make it our new `deep` setting and remove it from the array
            deep = objs.shift();
        }

        //take the first object from the arguments, store it as our container, and remove it from the array
        var container = objs.shift();

        //iterate through the rest of our argument objects
        objs.forEach(function(item) {
            //mutate our container object by merging it with this item in the array
            container = this.fn.utils.mergeObjects(container, item, deep);
        }, this);

        //return the merged objects as a single object
        return container;
    };