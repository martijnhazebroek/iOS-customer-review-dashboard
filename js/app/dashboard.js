define(['jquery', 'app/configurator', 'mustache', 'app/logger', 'app/datasource'],
  function($, configurator, templateEngine, logger, datasource) {

    var config = configurator.getConfig();

    function _isSpecialUser(user, specialUsers) {
      return $.inArray(user, specialUsers) > -1;
    }

    function _getCssClassForRating(isSpecialUser, rating) {
      if (isSpecialUser) {
        return 'warning';
      }
      return rating >= config.app.dashboard.isGoodRatingWhenAtLeastNumberOfStars ? 'success' : 'danger';
    }

    function _replaceKeywords(keywords, text) {
      var result = text;
      $.each(keywords, function(i, keyword) {
        result = result.replace(new RegExp(keyword, 'gi'), '<mark>$&</mark>');
      });
      return result;
    }

    function _decorateData(entries) {
      var appInfo, viewModels = [];
      $.each(entries, function(i, item) {
        // this item contains App info
        if (!item.content) {
          appInfo = {
            icon: item['im:image'][0],
            name: item['im:name'].label,
            title: item.title.label
          };
          return;
        }

        // create viewModel. do the actual decorating of the data.
        var userIsSpecialUser = _isSpecialUser(item.author.name.label, config.app.dashboard.specialUsers);
        var rating = parseInt(item['im:rating'].label);
        var viewModel = {
          index: i,
          isSpecialUser: userIsSpecialUser,
          author: item.author.name.label,
          title: item.title.label,
          rating: rating,
          cssClass: _getCssClassForRating(userIsSpecialUser, rating)
        };

        // replace all keywords.
        viewModel = $.extend(viewModel, {
          contentHTML: _replaceKeywords(config.app.dashboard.keywords, item.content.label)
        });

        // collect the results.
        viewModels.push(viewModel);
      });

      return {
        appInfo: appInfo,
        subViewModels: viewModels
      };
    }

    function _renderTemplate(viewModels) {
      var template = $('#template').html();

      templateEngine.parse(template);
      var rendered = templateEngine.render(template, viewModels);
      $('#target').html(rendered);

      require(['bootstrap', 'bootstrapTable']);
    }

    function run() {
      datasource.loadReviews({
          appId: config.app.id,
          language: config.language
        })
        .done(function() {
          var lines = arguments;
          _renderTemplate(_decorateData(lines));
        });
    }

    return {
      run: run
    };
  });
