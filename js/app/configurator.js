'use strict';

define(['jquery', 'URI', 'app/config'], function($, uri, config) {
  var queryOptions = uri().query(true),
    configInstance = null;

  function getConfig() {
    if (!configInstance) {
      configInstance = _mergeConfigWithDefaults(config);
    }
    return configInstance;
  }

  function _getApp(apps, defaults) {
    if (!queryOptions || !queryOptions.app) {
      return apps[0];
    }

    var results = $.grep(apps, function(app, i) {
      return app.name.toUpperCase() === decodeURIComponent(queryOptions.app).toUpperCase();
    });

    return results[0];
  }

  function _getLanguage(app, defaults) {
    return !queryOptions || !queryOptions.lang ? (app.language !== undefined ? app.language : defaults.language) : queryOptions.lang;
  }

  function _getIsDebug(defaults) {
    return !queryOptions || !queryOptions.debug ? defaults.debug : console && queryOptions.debug !== 'false';
  }

  function _mergeConfigWithDefaults(config) {
    var userDefinedDefaults = config.defaults || {};
    var defaults = $.extend(true, {
      debug: false,
      language: 'en',
      dashboard: {
        keywords: [],
        specialUsers: [],
        isGoodRatingWhenAtLeastNumberOfStars: 4
      },
      cloud: {
        wait: 50,
        gridSize: 10,
        rotateRatio: 0,
        font: 'arial, helvetica, clean, sans-serif',
        irrelevant: [],
        synonyms: {},
        palette: {
          max: '#893A53',
          med: '#4E5F7D',
          low: '#D9AB73'
        }
      }
    }, userDefinedDefaults);

    var appConfigs = [];
    for (var i = 0; i < config.apps.length; i++) {
      appConfigs.push($.extend(true, {}, defaults, config.apps[i]));
    }

    var app = _getApp(appConfigs, defaults);
    var config = {
      app: app,
      language: _getLanguage(app, defaults),
      isGoodRatingWhenAtLeastNumberOfStars: defaults.isGoodRatingWhenAtLeastNumberOfStars,
      debug: _getIsDebug(defaults)
    };

    return config;
  }

  return {
    getConfig: getConfig
  };

});
