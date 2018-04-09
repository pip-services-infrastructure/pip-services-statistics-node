"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let moment = require('moment-timezone');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_oss_node_1 = require("pip-services-oss-node");
const StatCounterTypeV1_1 = require("../data/version1/StatCounterTypeV1");
const StatRecordsMongoDbSchema_1 = require("./StatRecordsMongoDbSchema");
const StatCounterKeyGenerator_1 = require("./StatCounterKeyGenerator");
class StatisticsMongoDbPersistence extends pip_services_oss_node_1.IdentifiableMongoDbPersistence {
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
        let timezone = filter.getAsNullableString('timezone');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let fromId = fromTime != null ? StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKeyFromTime(group, name, type, fromTime, timezone) : null;
        if (fromId != null)
            criteria.push({ _id: { $gte: fromId } });
        let toTime = filter.getAsNullableDateTime('to_time');
        let toId = toTime != null ? StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKeyFromTime(group, name, type, toTime, timezone) : null;
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
    addPartialIncrement(batch, group, name, type, momentTime, value) {
        let id = StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKeyFromMoment(group, name, type, momentTime);
        let data = {
            group: group,
            name: name,
            type: type
        };
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total) {
            data.year = momentTime.year();
            if (type != StatCounterTypeV1_1.StatCounterTypeV1.Year) {
                data.month = momentTime.month() + 1;
                if (type != StatCounterTypeV1_1.StatCounterTypeV1.Month) {
                    data.day = momentTime.date();
                    if (type != StatCounterTypeV1_1.StatCounterTypeV1.Day) {
                        data.hour = momentTime.hour();
                    }
                }
            }
        }
        batch
            .find({
            _id: id
        })
            .upsert()
            .updateOne({
            $set: data,
            $inc: {
                value: value
            }
        });
    }
    addOneIncrement(batch, group, name, time, timezone, value) {
        let tz = timezone || 'UTC';
        let momentTime = moment(time).tz(tz);
        this.addPartialIncrement(batch, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Total, momentTime, value);
        this.addPartialIncrement(batch, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Year, momentTime, value);
        this.addPartialIncrement(batch, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Month, momentTime, value);
        this.addPartialIncrement(batch, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Day, momentTime, value);
        this.addPartialIncrement(batch, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Hour, momentTime, value);
    }
    incrementOne(correlationId, group, name, time, timezone, value, callback) {
        let batch = this._model.collection.initializeUnorderedBulkOp();
        this.addOneIncrement(batch, group, name, time, timezone, value);
        batch.execute((err) => {
            if (err == null)
                this._logger.trace(correlationId, "Incremented %s.%s", group, name);
            if (callback)
                callback(null, err == null);
        });
    }
    incrementBatch(correlationId, increments, callback) {
        if (increments == null || increments.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let batch = this._model.collection.initializeUnorderedBulkOp();
        for (let increment of increments) {
            this.addOneIncrement(batch, increment.group, increment.name, increment.time, increment.timezone, increment.value);
        }
        batch.execute((err) => {
            if (err == null)
                this._logger.trace(correlationId, "Incremented %d counters", increments.length);
            if (callback)
                callback(null);
        });
    }
}
exports.StatisticsMongoDbPersistence = StatisticsMongoDbPersistence;
//# sourceMappingURL=StatisticsMongoDbPersistence.js.map