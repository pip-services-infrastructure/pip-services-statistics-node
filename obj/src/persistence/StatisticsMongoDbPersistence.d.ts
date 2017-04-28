import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services-data-node';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
import { IStatisticsPersistence } from './IStatisticsPersistence';
export declare class StatisticsMongoDbPersistence extends IdentifiableMongoDbPersistence<StatCounterRecordV1, string> implements IStatisticsPersistence {
    constructor();
    getGroups(correlationId: string, paging: PagingParams, callback: (err: any, page: DataPage<string>) => void): void;
    private composeFilter(filter);
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: any): void;
    getListByFilter(correlationId: string, filter: FilterParams, callback: any): void;
    private incrementOne(correlationId, group, name, type, time, value, callback?);
    increment(correlationId: string, group: string, name: string, time: Date, value: number, callback?: (err: any, added: boolean) => void): void;
}
