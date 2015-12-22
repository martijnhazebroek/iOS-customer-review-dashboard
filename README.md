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


## Remarks

Not everything is configurable via the UI (yet?). An example of the full url with all query string parameters is:

    file:///your-local-file-sytem-dir/iOS-ratings-dashboard.html?app=keynote&lang=en&page=2&debug
