var MetricsCatalog=function(){"use strict";class t{constructor(e){if(this.options=e,!t.validateOptions(e))throw new Error("You must provide a valid host option!")}init(){if(!window.PerformanceNavigationTiming||!window.PerformanceResourceTiming||!window.PerformancePaintTiming)throw new Error("Your browser doesn't support some or all of these APIS: PerformanceNavigationTiming, PerformanceResourceTiming, PerformancePaintTiming.");window.addEventListener("load",()=>{setTimeout(()=>{const e=this.collectMetrics();t.postMetrics(e)},500)})}static validateOptions(t){return!(!t||"object"!=typeof t)&&!(!t.host||"string"!=typeof t.host||!t.host.trim().length)}static getNavigationMetrics(){const t=window.performance.getEntriesByType("navigation")[0];return{ttfb:t.responseStart-t.requestStart,domContentLoaded:t.domContentLoadedEventEnd-t.domContentLoadedEventStart,windowLoaded:t.loadEventEnd-t.loadEventStart}}static getResourceMetrics(){return{resources:window.performance.getEntriesByType("resource").map(t=>({name:t.name,requestStart:t.requestStart,responseEnd:t.responseEnd,startTime:t.startTime}))}}static getPaintMetrics(){return{fcp:window.performance.getEntriesByType("paint").filter(t=>"first-contentful-paint"===t.name)[0].startTime}}collectMetrics(){return Object.assign(Object.assign(Object.assign({host:this.options.host,date:new Date},t.getPaintMetrics()),t.getResourceMetrics()),t.getNavigationMetrics())}static postMetrics(e){return fetch(t.URL,{method:"POST",mode:"cors",cache:"no-cache",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(t=>t.json()).then(console.log).catch(t=>console.error(t))}}return t.URL="https://metrics-catalog-api.herokuapp.com/metrics",t}();
