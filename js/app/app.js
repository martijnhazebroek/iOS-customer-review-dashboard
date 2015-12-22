define(['jquery', 'app/config', 'app/configurator', 'mustache', 'app/logger'], function($, config, configurator, templateEngine, logger) {
  // apply the defaults
  config = configurator.createConfig(config);

  function getData(pageNr) {
    var url = ['https://itunes.apple.com/', config.language, '/rss/customerreviews/page=', pageNr, '/id=', config.app.id, '/sortby=mostrecent/json'].join('');
    logger.debug('Data URL: %s', url);
    return $.getJSON(url);
  }

  function isSpecialUser(user) {
    return $.inArray(user, config.app.specialUsers) > -1;
  }

  function getCssClassForRating(isSpecialUser, rating) {
    if (isSpecialUser) return 'special_user';
    return rating >= config.isGoodRatingWhenAtLeastNumberOfStars ? 'good' : 'bad';
  }

  function replaceKeywords(keywords, text) {
    var result = text;
    $.each(keywords, function(i, keyword) {
      result = result.replace(new RegExp(keyword, 'i'), '<span class="keyword">$&</span>');
    });
    return result;
  };

  function decorateData(data, page) {
    logger.debug('RSS data %o', data);

    var appInfo, viewModels = [];
    $.each(data.feed.entry, function(i, item) {
      logger.debug('RSS item %i: %o', i, item);

      // this item contains App info
      if (!item.content) {
        appInfo = {
          icon: item['im:image'][0],
          name: item['im:name'].label,
          title: item.title.label,
          pages: data.feed.link.length - 2
        };
        return;
      }

      // create viewModel. do the actual decorating of the data.
      var userIsSpecialUser = isSpecialUser(item.author.name.label);
      var rating = parseInt(item['im:rating'].label);
      var viewModel = {
        index: i + ((page - 1) * 50),
        isSpecialUser: isSpecialUser,
        author: item.author.name.label,
        title: item.title.label,
        rating: rating,
        cssClass: getCssClassForRating(userIsSpecialUser, rating)
      };

      // replace all keywords.
      viewModel = $.extend(viewModel, {
        contentHTML: replaceKeywords(config.app.keywords, item.content.label)
      });

      // collect the results.
      viewModels.push(viewModel);
    });

    return {
      appInfo: appInfo,
      subViewModels: viewModels
    };
  }

  // trigger the rendering
  function renderTemplate(viewModels) {
    var template = $('#template').html();

    templateEngine.parse(template);
    var rendered = templateEngine.render(template, viewModels);
    $('#target').html(rendered);
  }

  // do the actual work.
  function run() {
    getData(config.page).done(function(data) {
      renderTemplate(decorateData(data, config.page));
    });
  }

  // return the interface.
  return {
    run: run
  };
});
