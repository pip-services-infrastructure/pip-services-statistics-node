let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DateTimeConverter } from 'pip-services-commons-node';

import { IStatisticsPersistence } from '../../src/persistence/IStatisticsPersistence';
import { StatCounterRecordV1 } from '../../src/data/version1/StatCounterRecordV1';
import { StatCounterTypeV1 } from '../../src/data/version1/StatCounterTypeV1';

export class StatisticsPersistenceFixture {
    private _persistence: IStatisticsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }
                
    public testCrudOperations(done) {
        async.series([
        // Increment counter
            (callback) => {
                this._persistence.increment(
                    null,
                    'test', 'value1', DateTimeConverter.toDateTime('1975-04-09T19:00:00.00Z'), 1,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Increment the same counter again
            (callback) => {
                this._persistence.increment(
                    null,
                    'test', 'value1', DateTimeConverter.toDateTime('1975-04-09T20:00:00.00Z'), 2,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Check all counters
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    null,
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 6);

                        callback();
                    }
                );
            },
        // Check total counters
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'group', 'test',
                        'name', 'value1',
                        'type', StatCounterTypeV1.Total
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        let record = page.data[0];
                        assert.equal(3, record.value);

                        callback();
                    }
                );
            }
        ], done);
    }
}
