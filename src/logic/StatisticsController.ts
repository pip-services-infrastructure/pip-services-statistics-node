let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';

import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
import { StatCounterV1 } from '../data/version1/StatCounterV1';
import { StatCounterIncrementV1 } from '../data/version1/StatCounterIncrementV1';
import { StatCounterValueV1 } from '../data/version1/StatCounterValueV1';
import { StatCounterValueSetV1 } from '../data/version1/StatCounterValueSetV1';
import { IStatisticsPersistence } from '../persistence/IStatisticsPersistence';
import { IStatisticsController } from './IStatisticsController';
import { StatisticsCommandSet } from './StatisticsCommandSet';

export class StatisticsController implements IConfigurable, IReferenceable, ICommandable, IStatisticsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-statistics:persistence:*:*:1.0',

        'options.facets_group', 'statistics'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(StatisticsController._defaultConfig);
    private _persistence: IStatisticsPersistence;
    private _commandSet: StatisticsCommandSet;
    private _facetsGroup: string = 'statistics';

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IStatisticsPersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new StatisticsCommandSet(this);
        return this._commandSet;
    }

    public getGroups(correlationId: string, paging: PagingParams,
        callback: (err: any, page: DataPage<string>) => void): void {
        this._persistence.getGroups(correlationId, paging, callback);
    }

    public getCounters(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<StatCounterV1>) => void): void {
        filter = filter || new FilterParams();
        filter.setAsObject('type', StatCounterTypeV1.Total);
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            if (err) callback(err, null);
            else {
                let counters = _.map(page.data, (x) => new StatCounterV1(x.group, x.name));
                callback(null, new DataPage<StatCounterV1>(counters, page.total));
            }
        });
    }

    public incrementCounter(correlationId: string, group: string, name: string,
        time: Date, timezone: string, value: number, callback?: (err: any) => void): void {

        time = DateTimeConverter.toDateTimeWithDefault(time, new Date());
        timezone = timezone || 'UTC';

        this._persistence.incrementOne(correlationId, group, name, time, timezone, value, callback);
    }

    public incrementCounters(correlationId: string, increments: StatCounterIncrementV1[],
        callback?: (err: any) => void): void {

        let tempIncrements: StatCounterIncrementV1[] = [];

        for (let increment of increments) {
            // Fix increments
            increment.time = DateTimeConverter.toDateTimeWithDefault(increment.time, new Date());
            let roundedToHours = Math.trunc((increment.time.getTime() + 3599999) / 3600000) * 3600000;
            increment.time = new Date(roundedToHours);
            increment.timezone = increment.timezone || 'UTC';

            // Find similar increment
            let tempIncrement = _.find(tempIncrements, (inc) => {
                return inc.group == increment.group
                    && inc.name == increment.name
                    && inc.time.getTime() == increment.time.getTime();
                }
            );
            if (tempIncrement != null)
                tempIncrement.value += increment.value;
            else
                tempIncrements.push(increment);
        }

        this._persistence.incrementBatch(correlationId, tempIncrements, callback);
    }

    public readOneCounter(correlationId: string, group: string, name: string, type: StatCounterTypeV1,
        fromTime: Date, toTime: Date, timezone: string,
        callback: (err: any, value: StatCounterValueSetV1) => void): void {
        let filter: FilterParams = FilterParams.fromTuples(
            'group', group,
            'name', name,
            'type', type,
            'from_time', fromTime,
            'to_time', toTime,
            'timezone', timezone
        );
        this._persistence.getListByFilter(correlationId, filter, (err, records) => {
            if (err) {
                if (callback) callback(err, null);
                return;
            }

            let set = new StatCounterValueSetV1(group, name, type, []);
            _.each(records, (x) => {
                set.values.push(
                    new StatCounterValueV1(
                        x.year, 
                        x.month,
                        x.day,
                        x.hour,
                        x.value
                    )
                );
            });

            if (callback) callback(null, set);
        })
    }

    public readCountersByGroup(correlationId: string, group: string, type: StatCounterTypeV1,
        fromTime: Date, toTime: Date, timezone: string,
        callback: (err: any, values: StatCounterValueSetV1[]) => void): void {
        let filter: FilterParams = FilterParams.fromTuples(
            'group', group,
            'type', type,
            'from_time', fromTime,
            'to_time', toTime,
            'timezone', timezone
        );
        this._persistence.getListByFilter(correlationId, filter, (err, records) => {
            if (err) {
                if (callback) callback(err, null);
                return;
            }

            let sets: any = {};
            let values: StatCounterValueSetV1[] = [];

            _.each(records, (x) => {
                let set = sets[x.name];
                if (set == null) {
                    set = new StatCounterValueSetV1(x.group, x.name, type, []);
                    sets[x.name] = set;
                    values.push(set);
                }

                set.values.push(
                    new StatCounterValueV1(
                        x.year, 
                        x.month,
                        x.day,
                        x.hour,
                        x.value
                    )
                );
            });

            if (callback) callback(null, values);
        })
    }

    public readCounters(correlationId: string, counters: StatCounterV1[], type: StatCounterTypeV1,
        fromTime: Date, toTime: Date, timezone: string,
        callback: (err: any, values: StatCounterValueSetV1[]) => void): void {
        let result: StatCounterValueSetV1[] = [];
        async.each(
            counters, 
            (counter, callback) => {
                return this.readOneCounter(
                    correlationId, counter.group, counter.name, type, fromTime, toTime, timezone,
                    (err, set) => {
                        if (set) result.push(set);
                        callback(err);
                    }
                );
            },
            (err) => {
                callback(err, result);
            }
        )
    }

}
