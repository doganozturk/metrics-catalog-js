# MetricsCatalog.js

[![CircleCI](https://circleci.com/gh/doganozturk/metrics-catalog-js/tree/master.svg?style=shield&circle-token=cd068c8a9e6f1b5093de193726ef3b4eb1d4a0cb)](https://circleci.com/gh/doganozturk/metrics-catalog-js/tree/master) [![npm](https://img.shields.io/npm/v/metrics-catalog-js.svg)](https://www.npmjs.com/package/metrics-catalog-js)

`metrics-catalog-js` is a tiny analytics library for collecting performance data such as TTFB, FCB etc.

## Features
- Measures TTFB, FCP, DomContentLoaded and window Load events.
- Measures network timings for resources such as images, fonts, css, js etc.
- Works in all modern browsers.
- Sends those performance metrics to our API.
- Can be used in any web application.
- Small size < 2KB Gzipped.

## Installation
- If you are using NPM: ```npm install metrics-catalog-js```
- You can also include the script directly. Just download the script from the [dist folder](https://github.com/doganozturk/metrics-catalog-js/tree/master/dist).

## Get started
- Usage with ES6 modules:

```javascript
import { MetricsCatalog } from 'metrics-catalog-js/dist/metrics-catalog.es.js';

const metricsCatalog = new MetricsCatalog({
    host: 'doganozturk.dev',
});

metricsCatalog.init();

```
- Usage in the browser (the `MetricsCatalog` global contains all of the functions):

```html
<script src="metrics-catalog.bundle.js"></script>

<script>
    const metricsCatalog = new MetricsCatalog({
        host: 'doganozturk.dev',
    });

    metricsCatalog.init();
</script>
```

## Compatibility
- Every decent web browser (Chrome, Firefox, Safari, Opera, Microsoft Edge, IE11)

## Examples
- See the demo.html file for a simple example.

## Local development setup
1. Download the repository.
2. Get Node.js v12.16.3 and install it if you haven't already.
3. Use ```npm install``` to install the necessary dependencies.
4. The source code is written in TypeScript in the `src` directory.
5. Run ```npm run build``` to build the library.
6. Run ```npm test``` to run the tests.

## Contribution
Pull requests and feature requests are welcome!

## Author
* **Doğan Öztürk** - [Github](https://github.com/doganozturk)
