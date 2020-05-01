type MetricsCatalogOptions = {
    host: string;
};

type MetricsCatalogValuesResource = {
    name: string;
    requestStart: DOMHighResTimeStamp;
    responseEnd: DOMHighResTimeStamp;
    startTime: DOMHighResTimeStamp;
};

type MetricsCatalogValues = {
    host: string;
    date: Date;
    ttfb: DOMHighResTimeStamp;
    fcp: DOMHighResTimeStamp;
    domContentLoaded: DOMHighResTimeStamp;
    windowLoaded: DOMHighResTimeStamp;
    resources: MetricsCatalogValuesResource[];
};

export default class MetricsCatalog {
    private static readonly URL =
        'https://metrics-catalog-api.herokuapp.com/metrics';
    private values: MetricsCatalogValues;

    constructor(public options: MetricsCatalogOptions) {
        if (
            !options ||
            typeof options !== 'object' ||
            typeof options.host !== 'string' ||
            !options.host ||
            !options.host.trim().length
        ) {
            throw new Error('You must provide a valid host option!');
        }
    }

    public init(): void {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const metrics = this.collectMetrics();

                MetricsCatalog.postMetrics(metrics);
            }, 500);
        });
    }

    private static getNavigationMetrics(): {
        ttfb: DOMHighResTimeStamp;
        domContentLoaded: DOMHighResTimeStamp;
        windowLoaded: DOMHighResTimeStamp;
    } {
        // https://developer.mozilla.org/en-US/docs/Web/Performance/Navigation_and_resource_timings
        const navigationEntries: PerformanceNavigationTiming = window.performance.getEntriesByType(
            'navigation',
        )[0] as PerformanceNavigationTiming;

        const ttfb =
            navigationEntries.responseStart - navigationEntries.requestStart;
        const domContentLoaded =
            navigationEntries.domContentLoadedEventEnd -
            navigationEntries.domContentLoadedEventStart;
        const windowLoaded =
            navigationEntries.loadEventEnd - navigationEntries.loadEventStart;

        return {
            ttfb,
            domContentLoaded,
            windowLoaded,
        };
    }

    private static getResourceMetrics(): {
        resources: MetricsCatalogValuesResource[];
    } {
        const resourceEntries: PerformanceEntryList = window.performance.getEntriesByType(
            'resource',
        );
        const resources = resourceEntries.map(
            (entry: PerformanceResourceTiming) => ({
                name: entry.name,
                requestStart: entry.requestStart,
                responseEnd: entry.responseEnd,
                startTime: entry.startTime,
            }),
        );

        return {
            resources,
        };
    }

    private static getPaintMetrics(): { fcp: DOMHighResTimeStamp } {
        // https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming
        const paintEntry: PerformanceEntry = window.performance
            .getEntriesByType('paint')
            .filter(
                (entry: PerformanceEntry) =>
                    entry.name === 'first-contentful-paint',
            )[0];

        return {
            fcp: paintEntry.startTime,
        };
    }

    private collectMetrics(): MetricsCatalogValues {
        return {
            host: this.options.host,
            date: new Date(),
            ...MetricsCatalog.getPaintMetrics(),
            ...MetricsCatalog.getResourceMetrics(),
            ...MetricsCatalog.getNavigationMetrics(),
        };
    }

    private static postMetrics(metrics: MetricsCatalogValues): Promise<void> {
        return fetch(MetricsCatalog.URL, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(metrics),
        })
            .then((response) => response.json())
            .then(console.log)
            .catch((err) => console.error(err));
    }
}
