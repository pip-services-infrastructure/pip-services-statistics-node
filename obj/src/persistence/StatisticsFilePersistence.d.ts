import { ConfigParams } from 'pip-services-commons-node';
import { JsonFilePersister } from 'pip-services-data-node';
import { StatisticsMemoryPersistence } from './StatisticsMemoryPersistence';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
export declare class StatisticsFilePersistence extends StatisticsMemoryPersistence {
    protected _persister: JsonFilePersister<StatCounterRecordV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
