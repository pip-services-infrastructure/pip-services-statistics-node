import { CommandSet } from 'pip-services-commons-node';
import { ICommand } from 'pip-services-commons-node';
import { Command } from 'pip-services-commons-node';
import { Schema } from 'pip-services-commons-node';
import { Parameters } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { ObjectSchema } from 'pip-services-commons-node';
import { ArraySchema } from 'pip-services-commons-node';
import { TypeCode } from 'pip-services-commons-node';
import { FilterParamsSchema } from 'pip-services-commons-node';
import { PagingParamsSchema } from 'pip-services-commons-node';

import { StatCounterV1Schema } from '../data/version1/StatCounterV1Schema';
import { StatCounterIncrementV1Schema } from '../data/version1/StatCounterIncrementV1Schema';
import { StatCounterV1 } from '../data/version1/StatCounterV1';
import { StatCounterValueSetV1 } from '../data/version1/StatCounterValueSetV1';
import { IStatisticsController } from './IStatisticsController';

export class StatisticsCommandSet extends CommandSet {
    private _logic: IStatisticsController;

	constructor(logic: IStatisticsController) {
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

	private makeGetGroupsCommand(): ICommand {
		return new Command(
			"get_groups",
			new ObjectSchema(true)
				.withOptionalProperty('paging', new PagingParamsSchema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.getGroups(correlationId, paging, callback);
			}
		);
	}

	private makeGetContersCommand(): ICommand {
		return new Command(
			"get_counters",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.getCounters(correlationId, filter, paging, callback);
			}
		);
	}

	private makeIncrementCounterCommand(): ICommand {
		return new Command(
			"increment_counter",
			new ObjectSchema(true)
				.withRequiredProperty('group', TypeCode.String)
				.withRequiredProperty('name', TypeCode.String)
				.withOptionalProperty('time', null) //TypeCode.DateTime)
				.withOptionalProperty('timezone', TypeCode.String)
				.withRequiredProperty('value', null), //TypeCode.Double)
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let group = args.getAsNullableString("group");
				let name = args.getAsNullableString("name");
				let time = args.getAsNullableDateTime("time");
				let timezone = args.getAsNullableString("timezone");
				let value = args.getAsDouble("value");
				this._logic.incrementCounter(correlationId, group, name, time, timezone, value, (err) => {
					callback(err, null);
				});
			}
		);
	}

	private makeIncrementCountersCommand(): ICommand {
		return new Command(
			"increment_counters",
			new ObjectSchema(true)
				.withRequiredProperty('increments', new ArraySchema(new StatCounterIncrementV1Schema())),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let increments = args.getAsObject("increments");
				this._logic.incrementCounters(correlationId, increments, (err) => {
					callback(err, null);
				});
			}
		);
	}

	private makeReadOneCounterCommand(): ICommand {
		return new Command(
			"read_one_counter",
			new ObjectSchema(true)
				.withRequiredProperty('group', TypeCode.String)
				.withRequiredProperty('name', TypeCode.String)
				.withRequiredProperty('type', TypeCode.Long)
				.withOptionalProperty('from_time', null) //TypeCode.DateTime)
				.withOptionalProperty('to_time', null) //TypeCode.DateTime)
				.withOptionalProperty('timezone', TypeCode.String),
				(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let group = args.getAsNullableString("group");
				let name = args.getAsNullableString("name");
				let type = args.getAsNullableInteger("type");
				let fromTime = args.getAsNullableDateTime("from_time");
				let toTime = args.getAsNullableDateTime("to_time");
				let timezone = args.getAsNullableString("timezone");
				this._logic.readOneCounter(correlationId, group, name, type, fromTime, toTime, timezone, callback);
			}
		);
	}

	private makeReadCountersByGroupCommand(): ICommand {
		return new Command(
			"read_counters_by_group",
			new ObjectSchema(true)
				.withRequiredProperty('group', TypeCode.String)
				.withRequiredProperty('type', TypeCode.Long)
				.withOptionalProperty('from_time', null) //TypeCode.DateTime)
				.withOptionalProperty('to_time', null) //TypeCode.DateTime)
				.withOptionalProperty('timezone', TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let group = args.getAsNullableString("group");
				let type = args.getAsNullableInteger("type");
				let fromTime = args.getAsNullableDateTime("from_time");
				let toTime = args.getAsNullableDateTime("to_time");
				let timezone = args.getAsNullableString("timezone");
				this._logic.readCountersByGroup(correlationId, group, type, fromTime, toTime, timezone, callback);
			}
		);
	}

	private makeReadCountersCommand(): ICommand {
		return new Command(
			"read_counters",
			new ObjectSchema(true)
				.withRequiredProperty('counters', new ArraySchema(new StatCounterV1Schema()))
				.withRequiredProperty('type', TypeCode.Long)
				.withOptionalProperty('from_time', null) //TypeCode.DateTime)
				.withOptionalProperty('to_time', null) //TypeCode.DateTime)
				.withOptionalProperty('timezone', TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let counters: StatCounterV1[] = args.get("counters");
				let type = args.getAsNullableInteger("type");
				let fromTime = args.getAsNullableDateTime("from_time");
				let toTime = args.getAsNullableDateTime("to_time");
				let timezone = args.getAsNullableString("timezone");
				this._logic.readCounters(correlationId, counters, type, fromTime, toTime, timezone, callback);
			}
		);
	}
}