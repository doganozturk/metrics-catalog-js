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
    // @ts-ignore
    private static readonly URL: string = process.env.API_URL;
    private values: MetricsCatalogValues;

    constructor(public options: MetricsCatalogOptions) {
        if (!MetricsCatalog.validateOptions(options)) {
            throw new Error('You must provide a valid host option!');
        }
    }

    public init(): void {
        if (
            !window.PerformanceNavigationTiming ||
            !window.PerformanceResourceTiming ||
            // https://github.com/Microsoft/TypeScript/issues/25461
            // @ts-ignore
            !window.PerformancePaintTiming
        ) {
            throw new Error(
                "Your browser doesn't support some or all of these APIS: PerformanceNavigationTiming, PerformanceResourceTiming, PerformancePaintTiming.",
            );
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                const metrics = this.collectMetrics();

                MetricsCatalog.postMetrics(metrics);
            }, 500);
        });
    }

    private static validateOptions(options: MetricsCatalogOptions): boolean {
        if (!options || typeof options !== 'object') {
            return false;
        }

        if (
            !options.host ||
            typeof options.host !== 'string' ||
            !options.host.trim().length
        ) {
            return false;
        }

        return true;
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
