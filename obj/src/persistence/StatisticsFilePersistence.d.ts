import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { StatisticsMemoryPersistence } from './StatisticsMemoryPersistence';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
export declare class StatisticsFilePersistence extends StatisticsMemoryPersistence {
    protected _persister: JsonFilePersister<StatCounterRecordV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
