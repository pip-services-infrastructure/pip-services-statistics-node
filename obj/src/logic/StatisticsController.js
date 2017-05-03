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
        this._facetsGroup = 'statistics';
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._facetsGroup = config.getAsStringWithDefault('options.facets_group', this._facetsGroup);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._facetsClient = this._dependencyResolver.getOneOptional('facets');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new StatisticsCommandSet_1.StatisticsCommandSet(this);
        return this._commandSet;
    }
    getGroups(correlationId, paging, callback) {
        // When facets client is defined then use it to retrieve groups
        if (this._facetsClient != null) {
            this._facetsClient.getFacetsByGroup(correlationId, this._facetsGroup, paging, (err, page) => {
                if (page != null) {
                    let data = _.map(page.data, (facet) => facet.group);
                    let result = new pip_services_commons_node_4.DataPage(data, page.total);
                    callback(err, result);
                }
                else {
                    callback(err, null);
                }
            });
        }
        else {
            this._persistence.getGroups(correlationId, paging, callback);
        }
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
        this._persistence.increment(correlationId, group, name, time, value, (err, added) => {
            // When facets client is defined then record facets
            if (err == null && this._facetsClient != null && added) {
                this._facetsClient.addFacet(correlationId, this._facetsGroup, group, (err) => {
                    if (callback)
                        callback(err);
                });
            }
            else {
                if (callback)
                    callback(err);
            }
        });
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
    readCountersByGroup(correlationId, group, type, fromTime, toTime, callback) {
        let filter = pip_services_commons_node_3.FilterParams.fromTuples('group', group, 'type', type, 'from_time', fromTime, 'to_time', toTime);
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
                    set = new StatCounterSetV1_1.StatCounterSetV1(x.group, x.name, type, []);
                    sets[x.name] = set;
                    values.push(set);
                }
                set.values.push(new StatCounterValueV1_1.StatCounterValueV1(x.year, x.month, x.day, x.hour, x.value));
            });
            if (callback)
                callback(null, values);
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
StatisticsController._defaultConfig = pip_services_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-statistics:persistence:*:*:1.0', 'dependencies.facets', 'pip-clients-facets:client:*:*:1.0', 'options.facets_group', 'statistics');
exports.StatisticsController = StatisticsController;
//# sourceMappingURL=StatisticsController.js.map