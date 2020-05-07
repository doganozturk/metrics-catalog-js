declare type MetricsCatalogOptions = {
    host: string;
};
export default class MetricsCatalog {
    options: MetricsCatalogOptions;
    private static readonly URL;
    private values;
    constructor(options: MetricsCatalogOptions);
    init(): void;
    private static validateOptions;
    private static getNavigationMetrics;
    private static getResourceMetrics;
    private static getPaintMetrics;
    private collectMetrics;
    private static postMetrics;
}
export {};
