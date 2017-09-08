import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
export declare class StatCounterKeyGenerator {
    static makeCounterTime(type: StatCounterTypeV1, time: Date, timezone: string): number;
    static makeCounterKey(group: string, name: string, type: StatCounterTypeV1, time: Date, timezone: string): string;
}
