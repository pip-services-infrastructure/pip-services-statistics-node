import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
import { StatCounterV1 } from '../data/version1/StatCounterV1';
import { StatCounterIncrementV1 } from '../data/version1/StatCounterIncrementV1';
import { StatCounterValueSetV1 } from '../data/version1/StatCounterValueSetV1';
export interface IStatisticsController {
    getGroups(correlationId: string, paging: PagingParams, callback: (err: any, page: DataPage<string>) => void): void;
    getCounters(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<StatCounterV1>) => void): void;
    incrementCounter(correlationId: string, group: string, name: string, time: Date, timezone: string, value: number, callback?: (err: any) => void): void;
    incrementCounters(correlationId: string, increments: StatCounterIncrementV1[], callback?: (err: any) => void): void;
    readOneCounter(correlationId: string, group: string, name: string, type: StatCounterTypeV1, fromTime: Date, toTime: Date, timezone: string, callback: (err: any, value: StatCounterValueSetV1) => void): void;
    readCountersByGroup(correlationId: string, group: string, type: StatCounterTypeV1, fromTime: Date, toTime: Date, timezone: string, callback: (err: any, values: StatCounterValueSetV1[]) => void): void;
    readCounters(correlationId: string, counters: StatCounterV1[], type: StatCounterTypeV1, fromTime: Date, toTime: Date, timezone: string, callback: (err: any, values: StatCounterValueSetV1[]) => void): void;
}
