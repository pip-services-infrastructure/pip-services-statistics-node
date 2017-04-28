let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';
import { DateTimeConverter } from 'pip-services-commons-node';

import { StatCounterV1 } from '../../src/data/version1/StatCounterV1';
import { StatCounterSetV1 } from '../../src/data/version1/StatCounterSetV1';
import { StatCounterTypeV1 } from '../../src/data/version1/StatCounterTypeV1';
import { StatisticsMemoryPersistence } from '../../src/persistence/StatisticsMemoryPersistence';
import { StatisticsController } from '../../src/logic/StatisticsController';
import { StatisticsLambdaFunction } from '../../src/container/StatisticsLambdaFunction';


suite('StatisticsLambdaFunction', ()=> {
    let lambda: StatisticsLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services-commons:logger:console:default:1.0',
            'persistence.descriptor', 'pip-services-statistics:persistence:memory:default:1.0',
            'controller.descriptor', 'pip-services-statistics:controller:default:default:1.0'
        );

        lambda = new StatisticsLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        async.series([
        // Increment counter
            (callback) => {
                lambda.act(
                    {
                        role: 'statistics',
                        cmd: 'increment_counter',
                        group: 'test', 
                        name: 'value1', 
                        time: DateTimeConverter.toDateTime('1975-04-09T19:00:00.00Z'), 
                        value: 1
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Increment the same counter again
            (callback) => {
                lambda.act(
                    {
                        role: 'statistics',
                        cmd: 'increment_counter',
                        group: 'test', 
                        name: 'value1', 
                        time: DateTimeConverter.toDateTime('1975-04-09T20:00:00.00Z'), 
                        value: 2
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Check all counters
            (callback) => {
                lambda.act(
                    {
                        role: 'statistics',
                        cmd: 'get_counters',
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Check all groups
            (callback) => {
                lambda.act(
                    {
                        role: 'statistics',
                        cmd: 'get_groups',
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Check total counters
            (callback) => {
                lambda.act(
                    {
                        role: 'statistics',
                        cmd: 'read_one_counter',
                        group: 'test', 
                        name: 'value1', 
                        type: StatCounterTypeV1.Total
                    },
                    (err, set) => {
                        assert.isNull(err);

                        assert.isObject(set);
                        assert.lengthOf(set.values, 1);

                        let record = set.values[0];
                        assert.equal(3, record.value);

                        callback();
                    }
                );
            },
        // Check monthly counters
            (callback) => {
                lambda.act(
                    {
                        role: 'statistics',
                        cmd: 'read_counters',
                        counters: [ new StatCounterV1('test', 'value1') ], 
                        type: StatCounterTypeV1.Hour, 
                        from_time: DateTimeConverter.toDateTime('1975-04-09T19:00:00.00Z'),
                        to_time: DateTimeConverter.toDateTime('1975-04-09T19:00:00.00Z'),
                    },
                    (err, sets) => {
                        assert.isNull(err);

                        assert.lengthOf(sets, 1);

                        let set = sets[0];
                        assert.isObject(set);
                        assert.lengthOf(set.values, 1);

                        let record = set.values[0];
                        assert.equal(1, record.value);

                        callback();
                    }
                );
            }
        ], done);
    });
});