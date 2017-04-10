let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { DependencyResolver } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';

import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
import { StatCounterV1 } from '../data/version1/StatCounterV1';
import { StatCounterValueV1 } from '../data/version1/StatCounterValueV1';
import { StatCounterSetV1 } from '../data/version1/StatCounterSetV1';
import { IStatisticsPersistence } from '../persistence/IStatisticsPersistence';
import { IStatisticsBusinessLogic } from './IStatisticsBusinessLogic';
import { StatisticsCommandSet } from './StatisticsCommandSet';

export class StatisticsController implements IConfigurable, IReferenceable, ICommandable, IStatisticsBusinessLogic {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-statistics:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(StatisticsController._defaultConfig);
    private _persistence: IStatisticsPersistence;
    private _commandSet: StatisticsCommandSet;

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
        time: Date, value: number, callback?: (err: any) => void): void {
        this._persistence.increment(correlationId, group, name, time, value, callback);
    }

    public readOneCounter(correlationId: string, group: string, name: string, type: StatCounterTypeV1,
        fromTime: Date, toTime: Date, callback: (err: any, value: StatCounterSetV1) => void): void {
        let filter: FilterParams = FilterParams.fromTuples(
            'group', group,
            'name', name,
            'type', type,
            'from_time', fromTime,
            'to_time', toTime
        );
        this._persistence.getListByFilter(correlationId, filter, (err, records) => {
            if (err) {
                if (callback) callback(err, null);
                return;
            }

            let set = new StatCounterSetV1(group, name, type, []);
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

    public readCounters(correlationId: string, counters: StatCounterV1[], type: StatCounterTypeV1,
        fromTime: Date, toTime: Date, callback: (err: any, values: StatCounterSetV1[]) => void): void {
        let result: StatCounterSetV1[] = [];
        async.each(
            counters, 
            (counter, callback) => {
                return this.readOneCounter(
                    correlationId, counter.group, counter.name, type, fromTime, toTime,
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
