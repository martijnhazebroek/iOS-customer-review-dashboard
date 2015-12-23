# iOS Customer Review Dashboard

Simple dashboard that uses the Apple RSS feed to display customer reviews.

## Features

1. Config via JS and/or query string parameters.
1. Supports multiple applications (for example to monitor competitors).
1. Supports multiple app stores (languages).
1. Supports debug logging.
1. Underline specific indicators.
1. Give the review a (non-)positive background color when it has a minimum number of N stars.  
1. Highlight frequent reviewers.


## Installation

1. Git clone or [download the repo as a ZIP](https://github.com/martijnhazebroek/iOS-customer-review-dashboard/archive/master.zip).
1. Change/replace the content of js/app/config.js
1. For the dashboard to work you have to configure the appId(s) in the config.js. To lookup your appId you have to know your bundleId and look for the trackId at [iTunes lookup by bundleId](https://itunes.apple.com/lookup?bundleId={insert_bundle_id_here}). In case you don't know the bundleId you can do a search at [iTunes lookup by name](https://itunes.apple.com/search?media=software&term={insert_app_name_here}).

## Remarks

Not everything is configurable via the UI (yet?). An example of the full url with all query string parameters is:

    file:///your-local-file-sytem-dir/iOS-ratings-dashboard.html?app=keynote&lang=en&page=2&debug
