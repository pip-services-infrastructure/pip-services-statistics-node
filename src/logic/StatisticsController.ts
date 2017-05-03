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

import { IFacetsClientV1 } from 'pip-clients-facets-node';

import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
import { StatCounterV1 } from '../data/version1/StatCounterV1';
import { StatCounterValueV1 } from '../data/version1/StatCounterValueV1';
import { StatCounterSetV1 } from '../data/version1/StatCounterSetV1';
import { IStatisticsPersistence } from '../persistence/IStatisticsPersistence';
import { IStatisticsController } from './IStatisticsController';
import { StatisticsCommandSet } from './StatisticsCommandSet';

export class StatisticsController implements IConfigurable, IReferenceable, ICommandable, IStatisticsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-statistics:persistence:*:*:1.0',
        'dependencies.facets', 'pip-clients-facets:client:*:*:1.0',

        'options.facets_group', 'statistics'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(StatisticsController._defaultConfig);
    private _persistence: IStatisticsPersistence;
    private _facetsClient: IFacetsClientV1;
    private _commandSet: StatisticsCommandSet;
    private _facetsGroup: string = 'statistics';

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
        this._facetsGroup = config.getAsStringWithDefault('options.facets_group', this._facetsGroup);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IStatisticsPersistence>('persistence');
        this._facetsClient = this._dependencyResolver.getOneOptional<IFacetsClientV1>('facets');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new StatisticsCommandSet(this);
        return this._commandSet;
    }

    public getGroups(correlationId: string, paging: PagingParams,
        callback: (err: any, page: DataPage<string>) => void): void {
        // When facets client is defined then use it to retrieve groups
        if (this._facetsClient != null) {
            this._facetsClient.getFacetsByGroup(correlationId, this._facetsGroup, paging, (err, page) => {
                if (page != null) {
                    let data = _.map(page.data, (facet) => facet.group);
                    let result = new DataPage<string>(data, page.total);
                    callback(err, result);
                } else {
                    callback(err, null);
                }
            });
        } 
        // Otherwise retrieve groups directly. But that is going to be VERY slow. Don't use it in production!
        else {
            this._persistence.getGroups(correlationId, paging, callback);
        }
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
        this._persistence.increment(correlationId, group, name, time, value, (err, added) => {
            // When facets client is defined then record facets
            if (err == null && this._facetsClient != null && added) {
                this._facetsClient.addFacet(correlationId, this._facetsGroup, group, (err) => {
                    if (callback) callback(err);
                });
            } else {
                if (callback) callback(err);
            }
        });
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

    public readCountersByGroup(correlationId: string, group: string, type: StatCounterTypeV1,
        fromTime: Date, toTime: Date, callback: (err: any, values: StatCounterSetV1[]) => void): void {
        let filter: FilterParams = FilterParams.fromTuples(
            'group', group,
            'type', type,
            'from_time', fromTime,
            'to_time', toTime
        );
        this._persistence.getListByFilter(correlationId, filter, (err, records) => {
            if (err) {
                if (callback) callback(err, null);
                return;
            }

            let sets: any = {};
            let values: StatCounterSetV1[] = [];

            _.each(records, (x) => {
                let set = sets[x.name];
                if (set == null) {
                    set = new StatCounterSetV1(x.group, x.name, type, []);
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
