type MetricsCatalogOptions = {
    host: string;
};

type MetricsCatalogValuesResource = {
    name: string;
    requestStart: number;
    responseEnd: number;
    startTime: number;
};

type MetricsCatalogValues = {
    host: string;
    date: Date;
    ttfb: number;
    fcp: number;
    domContentLoaded: number;
    windowLoaded: number;
    resources: MetricsCatalogValuesResource[];
};

export default class MetricsCatalog {
    private url = 'http://httpbin.org/anything';
    private values: MetricsCatalogValues;

    constructor(public options: MetricsCatalogOptions) {}

    public init(): void {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const metrics = this.collectMetrics();

                this.postMetrics(metrics);
            }, 500);
        });
    }

    private static getNavigationRelatedMetrics(): {
        ttfb: number;
        domContentLoaded: number;
        windowLoaded: number;
    } {
        const navigationEntries: PerformanceNavigationTiming = window.performance.getEntriesByType(
            'navigation',
        )[0] as PerformanceNavigationTiming;

        const ttfb =
            navigationEntries.responseStart - navigationEntries.requestStart;
        const domContentLoaded = navigationEntries.domContentLoadedEventEnd;
        const windowLoaded = navigationEntries.loadEventEnd;

        return {
            ttfb,
            domContentLoaded,
            windowLoaded,
        };
    }

    private static getPaintRelatedMetrics(): {
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

    private static getResourceRelatedMetrics(): { fcp: number } {
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
            ...MetricsCatalog.getPaintRelatedMetrics(),
            ...MetricsCatalog.getResourceRelatedMetrics(),
            ...MetricsCatalog.getNavigationRelatedMetrics(),
        };
    }

    private postMetrics(metrics: MetricsCatalogValues): Promise<void> {
        return fetch(this.url, {
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
