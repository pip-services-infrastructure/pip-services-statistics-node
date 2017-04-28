let _ = require('lodash');
let async = require('async');

import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services-data-node';

import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
import { IStatisticsPersistence } from './IStatisticsPersistence';
import { StatRecordsMongoDbSchema } from './StatRecordsMongoDbSchema';
import { StatCounterKeyGenerator } from './StatCounterKeyGenerator';

export class StatisticsMongoDbPersistence 
    extends IdentifiableMongoDbPersistence<StatCounterRecordV1, string> 
    implements IStatisticsPersistence {

    constructor() {
        super('statistics', StatRecordsMongoDbSchema());
        this._maxPageSize = 1000;
    }

    public getGroups(correlationId: string, paging: PagingParams,
        callback: (err: any, page: DataPage<string>) => void): void {
        
        // Extract a page
        paging = paging != null ? paging : new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);

        let filter = { type: 0 };
        let options = { select: "group" };
        
        this._model.find({}, options, (err, items) => {
            if (items != null) {
                items = _.map(items, (item) => item.group);
                items = _.uniq(items);
            
                let total = null;
                if (paging.total)
                    total = items.length;
                
                if (skip > 0)
                    items = _.slice(items, skip);
                items = _.take(items, take);
                        
                let page = new DataPage<string>(items, total);
                callback(null, page);
            } else {
                callback(err, null);
            }
        });
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ group: { $regex: searchRegex } });
            searchCriteria.push({ name: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }

        let group = filter.getAsNullableString('group');
        if (group != null)
            criteria.push({ group: group });

        let name = filter.getAsNullableString('name');
        if (name != null)
            criteria.push({ name: name });

        let type = filter.getAsNullableInteger('type');
        if (type != null)
            criteria.push({ type: type });

        let fromTime = filter.getAsNullableDateTime('from_time');
        let fromId = fromTime != null ? StatCounterKeyGenerator.makeCounterKey(group, name, type, fromTime) : null;
        if (fromId != null)
            criteria.push({ _id: { $gte: fromId } });

        let toTime = filter.getAsNullableDateTime('to_time');
        let toId = toTime != null ? StatCounterKeyGenerator.makeCounterKey(group, name, type, toTime) : null;
        if (toId != null)
            criteria.push({ _id: { $lt: toId } });

        return criteria.length > 0 ? { $and: criteria } : {};
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: any) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, '-_id', null, callback);
    }

    public getListByFilter(correlationId: string, filter: FilterParams, callback: any) {
        super.getListByFilter(correlationId, this.composeFilter(filter), '-_id', null, callback);
    }

    private incrementOne(correlationId: string, group: string, name: string, type: StatCounterTypeV1,
        time: Date, value: number, callback?: (err: any, item: StatCounterRecordV1) => void): void {
        let id = StatCounterKeyGenerator.makeCounterKey(group, name, type, time);
        let record = new StatCounterRecordV1(group, name, type, time, value);

        let filter = {
            _id: id
        };

        let oldData: any = {
            group: group,
            name: name,
            type: type
        };
        if (type != StatCounterTypeV1.Total) {
            oldData.year = record.year;
            if (type != StatCounterTypeV1.Year) {
                oldData.month = record.month;
                if (type != StatCounterTypeV1.Month) {
                    oldData.day = record.day;
                    if (type != StatCounterTypeV1.Day) {
                        oldData.hour = record.hour;
                    }
                }
            }
        }

        let data = {
            $set: oldData,
            $inc: {
                value: value
            }
        }

        let options = {
            new: true,
            upsert: true
        };
        
        this._model.findOneAndUpdate(filter, data, options, (err, newItem) => {
            if (callback) {
                newItem = this.convertToPublic(newItem);
                callback(err, newItem);
            }
        });
    }

    public increment(correlationId: string, group: string, name: string,
        time: Date, value: number,  callback?: (err: any, added: boolean) => void): void {
        let added = false;
        async.parallel([
            (callback) => {
                this.incrementOne(
                    correlationId, group, name, StatCounterTypeV1.Total, time, value,
                    (err, data) => {
                        added = data != null ? data.value == value : false;
                        callback();
                    }
                );
            },
            (callback) => {
                this.incrementOne(
                    correlationId, group, name, StatCounterTypeV1.Year, time, value,
                    callback
                );
            },
            (callback) => {
                this.incrementOne(
                    correlationId, group, name, StatCounterTypeV1.Month, time, value,
                    callback
                );
            },
            (callback) => {
                this.incrementOne(
                    correlationId, group, name, StatCounterTypeV1.Day, time, value,
                    callback
                );
            },
            (callback) => {
                this.incrementOne(
                    correlationId, group, name, StatCounterTypeV1.Hour, time, value,
                    callback
                );
            }
        ], (err) => {
            if (err == null)
               this._logger.trace(correlationId, "Incremented %s.%s", group, name);
            if (callback) callback(err, added)
        });
    }
}
