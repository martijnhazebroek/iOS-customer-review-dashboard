'use strict';

define(['jquery', 'mathjs', 'app/grammar', 'app/logger'], function($, math, grammar, logger) {

  function countWords(config) {
    return loadReviews(config)
      .then(function() {
          var words = grammar.countWords(arguments, config),
            stats = _calcStats(words);

          return {
            words: words,
            stats: stats
          };
        },
        logger.error
      );
  }

  function loadReviews(config) {
    return config.page ? _loadReviewSinglePage(config) : _loadReviewPages(config);
  }

  function _loadReviewSinglePage(config) {
    return $.getJSON([
      'https://itunes.apple.com/',
      config.language,
      '/rss/customerreviews/page=',
      config.page,
      '/id=',
      config.appId,
      '/sortby=mostrecent/json'
    ].join(''));
  }

  function _loadReviewPages(config) {
    var deferred = $.Deferred(),
      deferreds = [
        _loadReviewSinglePage({
          page: 1,
          language: config.language,
          appId: config.appId
        })
      ];

    // first load the first page.
    deferreds[0]
      .then(function(data) {
          // then load all available pages.
          var maxPages = data.feed.link[3].attributes.href.match(/^.*rss\/customerreviews\/page=(\d+)/)[1];
          for (var i = 2; i <= maxPages; i++) {
            deferreds.push(
              _loadReviewSinglePage({
                page: i,
                language: config.language,
                appId: config.appId
              })
            );
          }
          return deferreds;
        },
        logger.error
      )
      .then(function(deferreds) {
          // when all loading is done merge the results.
          $.when.apply($, deferreds)
            .done(function() {
              var data = arguments;
              deferred.resolveWith(this, _mergeReviews(data));
            });
        },
        logger.error
      );

    // promise we will return all data.
    return deferred.promise();
  }

  function _mergeReviews(data) {
    var lines = [];

    for (var i = 0; i < data.length; i++) {
      // index differs when only one page with data was loaded.
      var feed = data[i][0] ? data[i][0].feed : data[i].feed;
      if (!feed) {
        continue;
      }

      $.each(feed.entry, function(i, item) {
        lines.push(item);
      });
    }

    return lines;
  }

  function _calcStats(words) {
    var weights = [];
    for (var el in words) {
      if (words.hasOwnProperty(el)) {
        weights.push(words[el].weight);
      }
    }
    return {
      max: math.max(weights),
      median: math.median(weights),
      std: math.std(weights)
    };
  }

  return {
    loadReviews: loadReviews,
    countWords: countWords
  };

});
