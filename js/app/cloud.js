'use strict';

define(['app/configurator', 'wordcloud', 'app/datasource', 'app/logger'],
  function(configurator, wordcloud, datasource, logger) {

    var config = configurator.getConfig();

    function plotWordcloud(words, stats) {
      wordcloud('target', {
        list: words,
        wait: config.app.cloud.wait,
        fontFamily: config.app.cloud.font,
        gridSize: config.app.cloud.gridSize,
        rotateRatio: config.app.cloud.rotateRatio,
        weightFactor: function(size) {
          return size * (2 * Math.max(1, Math.floor(75 / stats.max)));
        },
        color: function(word, weight, fontSize, distance, theta) {
          var palette = config.app.cloud.palette;
          return weight > stats.median + stats.std ? palette.max : (weight > stats.median ? palette.med : palette.low);
        },
        click: function(item, dimension, event) {
          alert(item.word + ': ' + item.weight);
        }
      });
    }

    function run() {
      datasource.countWords({
          appId: config.app.id,
          language: config.language,
          irrelevant: config.app.cloud.irrelevant,
          synonyms: config.app.cloud.synonyms
        })
        .then(function(data) {
            plotWordcloud(data.words, data.stats);
          },
          logger.error
        );
    }

    return {
      run: run
    };
  });
