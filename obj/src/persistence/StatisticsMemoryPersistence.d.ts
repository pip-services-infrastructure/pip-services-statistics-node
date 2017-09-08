import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services-data-node';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
import { IStatisticsPersistence } from './IStatisticsPersistence';
export declare class StatisticsMemoryPersistence extends IdentifiableMemoryPersistence<StatCounterRecordV1, string> implements IStatisticsPersistence {
    constructor();
    getGroups(correlationId: string, paging: PagingParams, callback: (err: any, page: DataPage<string>) => void): void;
    private matchString(value, search);
    private matchSearch(item, search);
    private composeFilter(filter);
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<StatCounterRecordV1>) => void): void;
    getListByFilter(correlationId: string, filter: FilterParams, callback: (err: any, list: StatCounterRecordV1[]) => void): void;
    private incrementOne(correlationId, group, name, type, time, timezone, value, callback?);
    increment(correlationId: string, group: string, name: string, time: Date, timezone: string, value: number, callback?: (err: any, added: boolean) => void): void;
}
