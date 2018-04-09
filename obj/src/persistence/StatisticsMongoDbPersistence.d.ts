import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services-oss-node';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
import { StatCounterIncrementV1 } from '../data/version1/StatCounterIncrementV1';
import { IStatisticsPersistence } from './IStatisticsPersistence';
export declare class StatisticsMongoDbPersistence extends IdentifiableMongoDbPersistence<StatCounterRecordV1, string> implements IStatisticsPersistence {
    constructor();
    getGroups(correlationId: string, paging: PagingParams, callback: (err: any, page: DataPage<string>) => void): void;
    private composeFilter(filter);
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: any): void;
    getListByFilter(correlationId: string, filter: FilterParams, callback: any): void;
    private addPartialIncrement(batch, group, name, type, momentTime, value);
    private addOneIncrement(batch, group, name, time, timezone, value);
    incrementOne(correlationId: string, group: string, name: string, time: Date, timezone: string, value: number, callback?: (err: any, added: boolean) => void): void;
    incrementBatch(correlationId: string, increments: StatCounterIncrementV1[], callback?: (err: any) => void): void;
}
