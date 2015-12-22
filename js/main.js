requirejs.config({
  baseUrl: 'js/lib',
  paths: {
    app: '../app',
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min',
    mustache: 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.2.1/mustache.min',
    URI: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.17.0/URI',
    punycode: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.17.0/punycode.min',
    IPv6: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.17.0/IPv6.min',
    SecondLevelDomains: 'https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.17.0/SecondLevelDomains.min'
  }
});

define(['require', 'app/app'], function(require, app) {
  app.run();
});
