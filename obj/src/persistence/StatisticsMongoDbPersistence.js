"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_data_node_1 = require("pip-services-data-node");
const StatCounterTypeV1_1 = require("../data/version1/StatCounterTypeV1");
const StatCounterRecordV1_1 = require("../data/version1/StatCounterRecordV1");
const StatRecordsMongoDbSchema_1 = require("./StatRecordsMongoDbSchema");
const StatCounterKeyGenerator_1 = require("./StatCounterKeyGenerator");
class StatisticsMongoDbPersistence extends pip_services_data_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('statistics', StatRecordsMongoDbSchema_1.StatRecordsMongoDbSchema());
        this._maxPageSize = 1000;
    }
    getGroups(correlationId, paging, callback) {
        // Extract a page
        paging = paging != null ? paging : new pip_services_commons_node_2.PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);
        let filter = { type: 0 };
        let options = { group: 1 };
        this._model.find(filter, options, (err, items) => {
            if (items != null) {
                items = _.map(items, (item) => item.group);
                items = _.uniq(items);
                let total = null;
                if (paging.total)
                    total = items.length;
                if (skip > 0)
                    items = _.slice(items, skip);
                items = _.take(items, take);
                let page = new pip_services_commons_node_3.DataPage(items, total);
                callback(null, page);
            }
            else {
                callback(err, null);
            }
        });
    }
    composeFilter(filter) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
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
        let fromId = fromTime != null ? StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKey(group, name, type, fromTime) : null;
        if (fromId != null)
            criteria.push({ _id: { $gte: fromId } });
        let toTime = filter.getAsNullableDateTime('to_time');
        let toId = toTime != null ? StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKey(group, name, type, toTime) : null;
        if (toId != null)
            criteria.push({ _id: { $lte: toId } });
        return criteria.length > 0 ? { $and: criteria } : {};
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getListByFilter(correlationId, filter, callback) {
        super.getListByFilter(correlationId, this.composeFilter(filter), null, null, callback);
    }
    incrementOne(correlationId, group, name, type, time, value, callback) {
        let id = StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKey(group, name, type, time);
        let record = new StatCounterRecordV1_1.StatCounterRecordV1(group, name, type, time, value);
        let filter = {
            _id: id
        };
        let oldData = {
            group: group,
            name: name,
            type: type
        };
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total) {
            oldData.year = record.year;
            if (type != StatCounterTypeV1_1.StatCounterTypeV1.Year) {
                oldData.month = record.month;
                if (type != StatCounterTypeV1_1.StatCounterTypeV1.Month) {
                    oldData.day = record.day;
                    if (type != StatCounterTypeV1_1.StatCounterTypeV1.Day) {
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
        };
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
    increment(correlationId, group, name, time, value, callback) {
        let added = false;
        async.parallel([
            (callback) => {
                this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Total, time, value, (err, data) => {
                    added = data != null ? data.value == value : false;
                    callback();
                });
            },
            (callback) => {
                this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Year, time, value, callback);
            },
            (callback) => {
                this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Month, time, value, callback);
            },
            (callback) => {
                this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Day, time, value, callback);
            },
            (callback) => {
                this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Hour, time, value, callback);
            }
        ], (err) => {
            if (err == null)
                this._logger.trace(correlationId, "Incremented %s.%s", group, name);
            if (callback)
                callback(err, added);
        });
    }
}
exports.StatisticsMongoDbPersistence = StatisticsMongoDbPersistence;
//# sourceMappingURL=StatisticsMongoDbPersistence.js.map