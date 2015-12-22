define(function() {
  return {
    debug: function() {
      console && console.debug && console.debug.apply(console, arguments);
    }
  }
});
