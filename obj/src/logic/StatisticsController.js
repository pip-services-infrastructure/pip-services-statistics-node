"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const StatCounterTypeV1_1 = require("../data/version1/StatCounterTypeV1");
const StatCounterV1_1 = require("../data/version1/StatCounterV1");
const StatCounterValueV1_1 = require("../data/version1/StatCounterValueV1");
const StatCounterValueSetV1_1 = require("../data/version1/StatCounterValueSetV1");
const StatisticsCommandSet_1 = require("./StatisticsCommandSet");
class StatisticsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(StatisticsController._defaultConfig);
        this._facetsGroup = 'statistics';
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new StatisticsCommandSet_1.StatisticsCommandSet(this);
        return this._commandSet;
    }
    getGroups(correlationId, paging, callback) {
        this._persistence.getGroups(correlationId, paging, callback);
    }
    getCounters(correlationId, filter, paging, callback) {
        filter = filter || new pip_services3_commons_node_3.FilterParams();
        filter.setAsObject('type', StatCounterTypeV1_1.StatCounterTypeV1.Total);
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            if (err)
                callback(err, null);
            else {
                let counters = _.map(page.data, (x) => new StatCounterV1_1.StatCounterV1(x.group, x.name));
                callback(null, new pip_services3_commons_node_4.DataPage(counters, page.total));
            }
        });
    }
    incrementCounter(correlationId, group, name, time, timezone, value, callback) {
        time = pip_services3_commons_node_5.DateTimeConverter.toDateTimeWithDefault(time, new Date());
        timezone = timezone || 'UTC';
        this._persistence.incrementOne(correlationId, group, name, time, timezone, value, callback);
    }
    incrementCounters(correlationId, increments, callback) {
        let tempIncrements = [];
        for (let increment of increments) {
            // Fix increments
            increment.time = pip_services3_commons_node_5.DateTimeConverter.toDateTimeWithDefault(increment.time, new Date());
            let roundedToHours = Math.trunc((increment.time.getTime() + 3599999) / 3600000) * 3600000;
            increment.time = new Date(roundedToHours);
            increment.timezone = increment.timezone || 'UTC';
            // Find similar increment
            let tempIncrement = _.find(tempIncrements, (inc) => {
                return inc.group == increment.group
                    && inc.name == increment.name
                    && inc.time.getTime() == increment.time.getTime();
            });
            if (tempIncrement != null)
                tempIncrement.value += increment.value;
            else
                tempIncrements.push(increment);
        }
        this._persistence.incrementBatch(correlationId, tempIncrements, callback);
    }
    readOneCounter(correlationId, group, name, type, fromTime, toTime, timezone, callback) {
        let filter = pip_services3_commons_node_3.FilterParams.fromTuples('group', group, 'name', name, 'type', type, 'from_time', fromTime, 'to_time', toTime, 'timezone', timezone);
        this._persistence.getListByFilter(correlationId, filter, (err, records) => {
            if (err) {
                if (callback)
                    callback(err, null);
                return;
            }
            let set = new StatCounterValueSetV1_1.StatCounterValueSetV1(group, name, type, []);
            _.each(records, (x) => {
                set.values.push(new StatCounterValueV1_1.StatCounterValueV1(x.year, x.month, x.day, x.hour, x.value));
            });
            if (callback)
                callback(null, set);
        });
    }
    readCountersByGroup(correlationId, group, type, fromTime, toTime, timezone, callback) {
        let filter = pip_services3_commons_node_3.FilterParams.fromTuples('group', group, 'type', type, 'from_time', fromTime, 'to_time', toTime, 'timezone', timezone);
        this._persistence.getListByFilter(correlationId, filter, (err, records) => {
            if (err) {
                if (callback)
                    callback(err, null);
                return;
            }
            let sets = {};
            let values = [];
            _.each(records, (x) => {
                let set = sets[x.name];
                if (set == null) {
                    set = new StatCounterValueSetV1_1.StatCounterValueSetV1(x.group, x.name, type, []);
                    sets[x.name] = set;
                    values.push(set);
                }
                set.values.push(new StatCounterValueV1_1.StatCounterValueV1(x.year, x.month, x.day, x.hour, x.value));
            });
            if (callback)
                callback(null, values);
        });
    }
    readCounters(correlationId, counters, type, fromTime, toTime, timezone, callback) {
        let result = [];
        async.each(counters, (counter, callback) => {
            return this.readOneCounter(correlationId, counter.group, counter.name, type, fromTime, toTime, timezone, (err, set) => {
                if (set)
                    result.push(set);
                callback(err);
            });
        }, (err) => {
            callback(err, result);
        });
    }
}
StatisticsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-statistics:persistence:*:*:1.0', 'options.facets_group', 'statistics');
exports.StatisticsController = StatisticsController;
//# sourceMappingURL=StatisticsController.js.map