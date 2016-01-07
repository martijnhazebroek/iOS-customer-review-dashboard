'use strict';

define(['jquery', 'mathjs'], function($, math) {

  function countWords(items, config) {
    var words = {};

    // iterate each RSS item
    $.each(items, function(i, item) {
      // if this item has nog content it contains App info
      if (!item.content) return;
      // iterate each word of the sentence.
      $.each(item.content.label.split(' '), function(i, word) {
        word = _sanitize(words, word, config);
        if (!word) {
          return;
        } else if (!words[word]) {
          words[word] = {
            word: word,
            weight: 0
          };
        }
        words[word].weight++;
      });
    });

    var results =
      _dictToArray(words)
      .sort(function(first, second) {
        return second.weight - first.weight;
      });

    return math.subset(results, math.index(math.range(':50')));
  }

  function _dictToArray(dict) {
    var results = [];
    for (var el in dict) {
      results.push(dict[el]);
    }
    return results;
  }

  function _sanitize(words, word, config) {
    var result = word.replace(/[^A-Za-z]/g, '').toLowerCase();

    if (!_isRelevantWord(word, {
        minWordLength: 3,
        irrelevant: config.irrelevant
      })) {

      return null;
    }

    var simularWordAllreadyProcessed =
      _checkAllReadyProcessed(result, {
        processed: words,
        synonyms: config.synonyms,
        languages: [config.language]
      });

    if (simularWordAllreadyProcessed) {
      return simularWordAllreadyProcessed;
    }

    return _deduplicate(result, {
      processed: words,
      languages: [config.language]
    });
  }

  function _isRelevantWord(word, config) {
    return word && word.length > config.minWordLength && !(config.irrelevant && $.inArray(word, config.irrelevant) > -1);
  }

  function _checkAllReadyProcessed(word, config) {
    if (config.processed[word]) {
      return word;
    }

    if (config.synonyms && config.synonyms[word]) {
      return config.synonyms[word];
    }

    return false;
  }

  function _deduplicate(word, config) {
    // for now only stupid simple deduplication: goed/goede, bank/banks
    var substitutions = {
      nl: ['e', 'en'],
      en: ['s']
    };
    for (var i = 0; i < config.languages.length; i++) {
      word = _onlyPluralOrSingular(config.processed, word, substitutions[config.languages[i]]);
    }
    return word;
  }

  function _onlyPluralOrSingular(words, word, suffixes) {
    // for now only stupid simple deduplication: goed/goede, bank/banken
    var result = word;
    for (var suffix in suffixes) {
      var suggestion = word + suffix;
      if (words[suggestion]) {
        result = suggestion;
        break;
      } else if (result.endsWith(suffix)) {
        suggestion = word.substr(0, word.length - suffix.length);
        result = words[suggestion] ? suggestion : word;
        break;
      }
    }
    return result;
  }

  return {
    countWords: countWords
  };
});
