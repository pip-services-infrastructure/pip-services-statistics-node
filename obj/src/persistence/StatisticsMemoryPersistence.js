"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_data_node_1 = require("pip-services-data-node");
const StatCounterTypeV1_1 = require("../data/version1/StatCounterTypeV1");
const StatCounterRecordV1_1 = require("../data/version1/StatCounterRecordV1");
const StatCounterKeyGenerator_1 = require("./StatCounterKeyGenerator");
class StatisticsMemoryPersistence extends pip_services_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._maxPageSize = 1000;
    }
    getGroups(correlationId, paging, callback) {
        let items = _.map(this._items, (item) => item.group);
        items = _.uniq(items);
        // Extract a page
        paging = paging != null ? paging : new pip_services_commons_node_2.PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);
        let total = null;
        if (paging.total)
            total = items.length;
        if (skip > 0)
            items = _.slice(items, skip);
        items = _.take(items, take);
        let page = new pip_services_commons_node_3.DataPage(items, total);
        callback(null, page);
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.group, search))
            return true;
        if (this.matchString(item.name, search))
            return true;
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
        let search = filter.getAsNullableString('search');
        let group = filter.getAsNullableString('group');
        let name = filter.getAsNullableString('name');
        let type = filter.getAsNullableInteger('type');
        let timezone = filter.getAsNullableString('timezone');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let fromId = fromTime != null ? StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKey(group, name, type, fromTime, timezone) : null;
        let toTime = filter.getAsNullableDateTime('to_time');
        let toId = toTime != null ? StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKey(group, name, type, toTime, timezone) : null;
        return (item) => {
            if (search != null && !this.matchSearch(item, search))
                return false;
            if (type != null && type != item.type)
                return false;
            if (group != null && item.group != group)
                return false;
            if (name != null && item.name != name)
                return false;
            if (fromId != null && item.id < fromId)
                return false;
            if (toId != null && item.id > toId)
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getListByFilter(correlationId, filter, callback) {
        super.getListByFilter(correlationId, this.composeFilter(filter), null, null, callback);
    }
    incrementOne(correlationId, group, name, type, time, timezone, value, callback) {
        let id = StatCounterKeyGenerator_1.StatCounterKeyGenerator.makeCounterKey(group, name, type, time, timezone);
        let item = this._items.find((x) => { return x.id == id; });
        if (item != null) {
            item.value += value;
        }
        else {
            item = new StatCounterRecordV1_1.StatCounterRecordV1(group, name, type, time, timezone, value);
            item.id = id;
            this._items.push(item);
        }
        if (callback)
            callback(null, item);
    }
    increment(correlationId, group, name, time, timezone, value, callback) {
        let added = false;
        this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Total, time, timezone, value, (err, data) => {
            added = data.value == value;
        });
        this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Year, time, timezone, value);
        this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Month, time, timezone, value);
        this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Day, time, timezone, value);
        this.incrementOne(correlationId, group, name, StatCounterTypeV1_1.StatCounterTypeV1.Hour, time, timezone, value);
        this._logger.trace(correlationId, "Incremented %s.%s", group, name);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err, added);
        });
    }
}
exports.StatisticsMemoryPersistence = StatisticsMemoryPersistence;
//# sourceMappingURL=StatisticsMemoryPersistence.js.map