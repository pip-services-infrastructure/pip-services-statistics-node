import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';

import { StatCounterV1 } from '../data/version1/StatCounterV1';
import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
import { StatCounterIncrementV1 } from '../data/version1/StatCounterIncrementV1';

export interface IStatisticsPersistence {
    getGroups(correlationId: string, paging: PagingParams,
        callback: (err: any, page: DataPage<string>) => void): void;

    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<StatCounterRecordV1>) => void): void;

    getListByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any, list: StatCounterRecordV1[]) => void): void;

    incrementOne(correlationId: string, group: string, name: string,
        time: Date, timezone: string, value: number,
        callback?: (err: any) => void): void;

    incrementBatch(correlationId: string, increments: StatCounterIncrementV1[],
        callback?: (err: any) => void): void;
}
