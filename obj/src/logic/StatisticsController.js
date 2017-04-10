"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const StatCounterTypeV1_1 = require("../data/version1/StatCounterTypeV1");
const StatCounterV1_1 = require("../data/version1/StatCounterV1");
const StatCounterValueV1_1 = require("../data/version1/StatCounterValueV1");
const StatCounterSetV1_1 = require("../data/version1/StatCounterSetV1");
const StatisticsCommandSet_1 = require("./StatisticsCommandSet");
class StatisticsController {
    constructor() {
        this._dependencyResolver = new pip_services_commons_node_2.DependencyResolver(StatisticsController._defaultConfig);
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
    getCounters(correlationId, filter, paging, callback) {
        filter = filter || new pip_services_commons_node_3.FilterParams();
        filter.setAsObject('type', StatCounterTypeV1_1.StatCounterTypeV1.Total);
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            if (err)
                callback(err, null);
            else {
                let counters = _.map(page.data, (x) => new StatCounterV1_1.StatCounterV1(x.group, x.name));
                callback(null, new pip_services_commons_node_4.DataPage(counters, page.total));
            }
        });
    }
    incrementCounter(correlationId, group, name, time, value, callback) {
        this._persistence.increment(correlationId, group, name, time, value, callback);
    }
    readOneCounter(correlationId, group, name, type, fromTime, toTime, callback) {
        let filter = pip_services_commons_node_3.FilterParams.fromTuples('group', group, 'name', name, 'type', type, 'from_time', fromTime, 'to_time', toTime);
        this._persistence.getListByFilter(correlationId, filter, (err, records) => {
            if (err) {
                if (callback)
                    callback(err, null);
                return;
            }
            let set = new StatCounterSetV1_1.StatCounterSetV1(group, name, type, []);
            _.each(records, (x) => {
                set.values.push(new StatCounterValueV1_1.StatCounterValueV1(x.year, x.month, x.day, x.hour, x.value));
            });
            if (callback)
                callback(null, set);
        });
    }
    readCounters(correlationId, counters, type, fromTime, toTime, callback) {
        let result = [];
        async.each(counters, (counter, callback) => {
            return this.readOneCounter(correlationId, counter.group, counter.name, type, fromTime, toTime, (err, set) => {
                if (set)
                    result.push(set);
                callback(err);
            });
        }, (err) => {
            callback(err, result);
        });
    }
}
StatisticsController._defaultConfig = pip_services_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-statistics:persistence:*:*:1.0');
exports.StatisticsController = StatisticsController;
//# sourceMappingURL=StatisticsController.js.map