import { IStringIdentifiable } from 'pip-services-commons-node';
import { StatCounterTypeV1 } from './StatCounterTypeV1';
export declare class StatCounterRecordV1 implements IStringIdentifiable {
    constructor(group: string, name: string, type: StatCounterTypeV1, time: Date, value: number);
    id: string;
    group: string;
    name: string;
    type: StatCounterTypeV1;
    year: number;
    month: number;
    day: number;
    hour: number;
    value: number;
}
