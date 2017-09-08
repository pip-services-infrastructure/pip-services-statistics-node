let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { DateTimeConverter } from 'pip-services-commons-node';

import { StatCounterV1 } from '../../../src/data/version1/StatCounterV1';
import { StatCounterValueSetV1 } from '../../../src/data/version1/StatCounterValueSetV1';
import { StatCounterTypeV1 } from '../../../src/data/version1/StatCounterTypeV1';
import { StatisticsMemoryPersistence } from '../../../src/persistence/StatisticsMemoryPersistence';
import { StatisticsController } from '../../../src/logic/StatisticsController';
import { StatisticsHttpServiceV1 } from '../../../src/services/version1/StatisticsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);


suite('StatisticsHttpServiceV1', ()=> {
    let service: StatisticsHttpServiceV1;

    let rest: any;

    suiteSetup((done) => {
        let persistence = new StatisticsMemoryPersistence();
        let controller = new StatisticsController();

        service = new StatisticsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-statistics', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-statistics', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-statistics', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    test('CRUD Operations', (done) => {
        async.series([
        // Increment counter
            (callback) => {
                rest.post('/statistics/increment_counter',
                    {
                        group: 'test', 
                        name: 'value1', 
                        time: DateTimeConverter.toDateTime('1975-04-09T19:00:00.00Z'), 
                        timezone: 'UTC',
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
                rest.post('/statistics/increment_counter',
                    {
                        group: 'test', 
                        name: 'value1', 
                        time: DateTimeConverter.toDateTime('1975-04-09T20:00:00.00Z'), 
                        timezone: 'UTC',
                        value: 2
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Check all counters
            (callback) => {
                rest.post('/statistics/get_counters',
                    { },
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Check all groups
            (callback) => {
                rest.post('/statistics/get_groups',
                    { },
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Check total counters
            (callback) => {
                rest.post('/statistics/read_one_counter',
                    {
                        group: 'test', 
                        name: 'value1', 
                        type: StatCounterTypeV1.Total
                    },
                    (err, req, res, set) => {
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
                rest.post('/statistics/read_counters',
                    {
                        counters: [ new StatCounterV1('test', 'value1') ], 
                        type: StatCounterTypeV1.Hour,
                        from_time: DateTimeConverter.toDateTime('1975-04-09T19:00:00.00Z'),
                        to_time: DateTimeConverter.toDateTime('1975-04-09T19:00:00.00Z'),
                        timezone: 'UTC'
                    },
                    (err, req, res, sets) => {
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