'use strict';

define(function() {
  return {
    debug: function() {
      console && console.debug && console.debug.apply(console, arguments);
    },
    error: function() {
      console && console.error && console.error.apply(console, arguments);
    }
  };
});
