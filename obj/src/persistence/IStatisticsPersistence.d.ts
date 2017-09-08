import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
export interface IStatisticsPersistence {
    getGroups(correlationId: string, paging: PagingParams, callback: (err: any, page: DataPage<string>) => void): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<StatCounterRecordV1>) => void): void;
    getListByFilter(correlationId: string, filter: FilterParams, callback: (err: any, list: StatCounterRecordV1[]) => void): void;
    increment(correlationId: string, group: string, name: string, time: Date, timezone: string, value: number, callback?: (err: any, added: boolean) => void): void;
}
