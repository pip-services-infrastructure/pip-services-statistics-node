"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_commons_node_5 = require("pip-services-commons-node");
const pip_services_commons_node_6 = require("pip-services-commons-node");
const pip_services_commons_node_7 = require("pip-services-commons-node");
const pip_services_commons_node_8 = require("pip-services-commons-node");
const pip_services_commons_node_9 = require("pip-services-commons-node");
const StatCounterV1Schema_1 = require("../data/version1/StatCounterV1Schema");
const StatCounterIncrementV1Schema_1 = require("../data/version1/StatCounterIncrementV1Schema");
class StatisticsCommandSet extends pip_services_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetGroupsCommand());
        this.addCommand(this.makeGetContersCommand());
        this.addCommand(this.makeIncrementCounterCommand());
        this.addCommand(this.makeIncrementCountersCommand());
        this.addCommand(this.makeReadCountersCommand());
        this.addCommand(this.makeReadCountersByGroupCommand());
        this.addCommand(this.makeReadOneCounterCommand());
    }
    makeGetGroupsCommand() {
        return new pip_services_commons_node_2.Command("get_groups", new pip_services_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('paging', new pip_services_commons_node_9.PagingParamsSchema()), (correlationId, args, callback) => {
            let paging = pip_services_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getGroups(correlationId, paging, callback);
        });
    }
    makeGetContersCommand() {
        return new pip_services_commons_node_2.Command("get_counters", new pip_services_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services_commons_node_8.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services_commons_node_9.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getCounters(correlationId, filter, paging, callback);
        });
    }
    makeIncrementCounterCommand() {
        return new pip_services_commons_node_2.Command("increment_counter", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group', pip_services_commons_node_7.TypeCode.String)
            .withRequiredProperty('name', pip_services_commons_node_7.TypeCode.String)
            .withOptionalProperty('time', null) //TypeCode.DateTime)
            .withRequiredProperty('value', null), //TypeCode.Double)
        (correlationId, args, callback) => {
            let group = args.getAsNullableString("group");
            let name = args.getAsNullableString("name");
            let time = args.getAsNullableDateTime("time");
            let value = args.getAsDouble("value");
            this._logic.incrementCounter(correlationId, group, name, time, value, (err) => {
                callback(err, null);
            });
        });
    }
    makeIncrementCountersCommand() {
        return new pip_services_commons_node_2.Command("increment_counters", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('increments', new pip_services_commons_node_6.ArraySchema(new StatCounterIncrementV1Schema_1.StatCounterIncrementV1Schema())), (correlationId, args, callback) => {
            let increments = args.getAsObject("increments");
            this._logic.incrementCounters(correlationId, increments, (err) => {
                callback(err, null);
            });
        });
    }
    makeReadOneCounterCommand() {
        return new pip_services_commons_node_2.Command("read_one_counter", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group', pip_services_commons_node_7.TypeCode.String)
            .withRequiredProperty('name', pip_services_commons_node_7.TypeCode.String)
            .withRequiredProperty('type', pip_services_commons_node_7.TypeCode.Long)
            .withOptionalProperty('from_time', null) //TypeCode.DateTime)
            .withOptionalProperty('to_time', null), //TypeCode.DateTime)
        (correlationId, args, callback) => {
            let group = args.getAsNullableString("group");
            let name = args.getAsNullableString("name");
            let type = args.getAsNullableInteger("type");
            let fromTime = args.getAsNullableDateTime("from_time");
            let toTime = args.getAsNullableDateTime("to_time");
            this._logic.readOneCounter(correlationId, group, name, type, fromTime, toTime, callback);
        });
    }
    makeReadCountersByGroupCommand() {
        return new pip_services_commons_node_2.Command("read_counters_by_group", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('group', pip_services_commons_node_7.TypeCode.String)
            .withRequiredProperty('type', pip_services_commons_node_7.TypeCode.Long)
            .withOptionalProperty('from_time', null) //TypeCode.DateTime)
            .withOptionalProperty('to_time', null), //TypeCode.DateTime)
        (correlationId, args, callback) => {
            let group = args.getAsNullableString("group");
            let type = args.getAsNullableInteger("type");
            let fromTime = args.getAsNullableDateTime("from_time");
            let toTime = args.getAsNullableDateTime("to_time");
            this._logic.readCountersByGroup(correlationId, group, type, fromTime, toTime, callback);
        });
    }
    makeReadCountersCommand() {
        return new pip_services_commons_node_2.Command("read_counters", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('counters', new pip_services_commons_node_6.ArraySchema(new StatCounterV1Schema_1.StatCounterV1Schema()))
            .withRequiredProperty('type', pip_services_commons_node_7.TypeCode.Long)
            .withOptionalProperty('from_time', null) //TypeCode.DateTime)
            .withOptionalProperty('to_time', null), //TypeCode.DateTime)
        (correlationId, args, callback) => {
            let counters = args.get("counters");
            let type = args.getAsNullableInteger("type");
            let fromTime = args.getAsNullableDateTime("from_time");
            let toTime = args.getAsNullableDateTime("to_time");
            this._logic.readCounters(correlationId, counters, type, fromTime, toTime, callback);
        });
    }
}
exports.StatisticsCommandSet = StatisticsCommandSet;
//# sourceMappingURL=StatisticsCommandSet.js.map