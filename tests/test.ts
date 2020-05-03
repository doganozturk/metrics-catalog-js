import * as dotenv from 'dotenv';
import MetricsCatalog from '../src/index';

dotenv.config();

describe('Object initialization', () => {
    test('it should initialize', () => {
        const metricsCatalog = new MetricsCatalog({
            host: 'doganozturk.dev',
        });

        expect(metricsCatalog).toBeInstanceOf(MetricsCatalog);
        expect(metricsCatalog).toHaveProperty('options');
        expect(metricsCatalog).toHaveProperty(
            'options.host',
            'doganozturk.dev',
        );
    });

    describe('Options validation', () => {
        test('it should throw before initialization without options object', () => {
            expect(MetricsCatalog).toThrowError();
        });

        test('it should throw before initialization with empty options object', () => {
            expect(() => {
                // @ts-ignore
                new MetricsCatalog({});
            }).toThrowError();
        });

        test('it should throw before initialization without options type', () => {
            expect(() => {
                // @ts-ignore
                new MetricsCatalog('doganozturk.dev');
            }).toThrowError();
        });

        describe('Host option parameter validation', () => {
            test('it should throw before initialization with wrong type host option', () => {
                expect(() => {
                    new MetricsCatalog({
                        // @ts-ignore
                        host: null,
                    });
                }).toThrowError();
            });

            test('it should throw before initialization with empty host option', () => {
                expect(() => {
                    new MetricsCatalog({
                        host: '',
                    });
                }).toThrowError();
            });

            test('it should throw before initialization with empty host string', () => {
                expect(() => {
                    new MetricsCatalog({
                        host: ' ',
                    });
                }).toThrowError();
            });
        });
    });
});

describe('init()', () => {
    test('it should have been called', () => {
        // eslint-disable-next-line
        MetricsCatalog.prototype.init = jest.fn(() => {});

        const metricsCatalog = new MetricsCatalog({
            host: 'doganozturk.dev',
        });

        metricsCatalog.init();

        expect(metricsCatalog.init).toHaveBeenCalledTimes(1);
    });
});
