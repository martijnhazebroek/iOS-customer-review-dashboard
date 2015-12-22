define(['jquery', 'URI'], function ($, uri) {
  var queryOptions = uri().query(true);

  function getApp(apps, defaults) {
    if(!queryOptions || !queryOptions.app)
      return apps[defaults.appIndex]

    var results = $.grep(apps, function(app, i) {
      return app.name.toUpperCase() === decodeURIComponent(queryOptions.app).toUpperCase();
    });

    return results.length == 1 ? results[0] : apps[defaults.appIndex];
  }

  function getLanguage(defaults) {
    return !queryOptions || !queryOptions.lang
      ? defaults.language
      : queryOptions.lang;
  }

  function getIsDebug(defaults) {
    return !queryOptions || !queryOptions.debug
      ? defaults.debug
      : console && queryOptions.debug != "false";
  }

  function getPage(defaults) {
    return !queryOptions || !queryOptions.page
      ? defaults.page
      : queryOptions.page
  }

  function createConfig(options) {

    var userDefinedDefaults = options.defaults || {};
    var defaults = $.extend(userDefinedDefaults, {
      appIndex: 0,
      page: 1,
      debug: false,
      language: 'nl',
      keywords: [],
      specialUsers: [],
      isGoodRatingWhenAtLeastNumberOfStars: 4
    });

    var apps = options.apps;
    for(i = 0; i < apps.length; i++) {
     $.extend(true, apps[i], defaults);
    }

    var config = {
      app: getApp(apps, defaults),
      language: getLanguage(defaults),
      page: getPage(defaults),
      isGoodRatingWhenAtLeastNumberOfStars: defaults.isGoodRatingWhenAtLeastNumberOfStars || 4,
      debug: getIsDebug(defaults)
    };

    if(config.debug) {
      console.log('Query options: %o', queryOptions);
      console.log('Config: %o', config);
    }

    return config;
  }

  return {
    createConfig: createConfig
  };

});
