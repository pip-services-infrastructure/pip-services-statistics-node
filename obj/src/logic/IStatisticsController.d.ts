import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
import { StatCounterV1 } from '../data/version1/StatCounterV1';
import { StatCounterSetV1 } from '../data/version1/StatCounterSetV1';
export interface IStatisticsController {
    getGroups(correlationId: string, paging: PagingParams, callback: (err: any, page: DataPage<string>) => void): void;
    getCounters(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<StatCounterV1>) => void): void;
    incrementCounter(correlationId: string, group: string, name: string, time: Date, value: number, callback?: (err: any) => void): void;
    readOneCounter(correlationId: string, group: string, name: string, type: StatCounterTypeV1, fromTime: Date, toTime: Date, callback: (err: any, value: StatCounterSetV1) => void): void;
    readCountersByGroup(correlationId: string, group: string, type: StatCounterTypeV1, fromTime: Date, toTime: Date, callback: (err: any, values: StatCounterSetV1[]) => void): void;
    readCounters(correlationId: string, counters: StatCounterV1[], type: StatCounterTypeV1, fromTime: Date, toTime: Date, callback: (err: any, values: StatCounterSetV1[]) => void): void;
}
