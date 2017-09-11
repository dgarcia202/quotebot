"use strict";

Array.prototype.first = function() { return this[0] };

Array.prototype.last = function() { return this[this.length - 1] };

Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0; });
};

Array.prototype.elementAt = function(i) { return this[i] };
