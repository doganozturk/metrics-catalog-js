declare type MetricsCatalogOptions = {
    host: string;
};
export default class MetricsCatalog {
    options: MetricsCatalogOptions;
    private url;
    private values;
    constructor(options: MetricsCatalogOptions);
    init(): void;
    private static getNavigationRelatedMetrics;
    private static getPaintRelatedMetrics;
    private static getResourceRelatedMetrics;
    private collectMetrics;
    private postMetrics;
}
export {};
