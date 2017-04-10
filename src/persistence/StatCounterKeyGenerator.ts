import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';

export class StatCounterKeyGenerator {

    public static makeCounterTime(type: StatCounterTypeV1, time: Date): number {
        let result = 0;

        if (type != StatCounterTypeV1.Total) {
            result = time.getUTCFullYear();

            if (type != StatCounterTypeV1.Year) {
                result = result * 100 + time.getUTCMonth() + 1;
                if (type != StatCounterTypeV1.Month) {
                    result = result * 100 + time.getUTCDate();
                    if (type != StatCounterTypeV1.Day) {
                        result = result * 100 + time.getUTCHours();
                    }
                }
            }
        }

        return result;
    }

    public static makeCounterKey(group: string, name: string, type: StatCounterTypeV1, time: Date): string {
        let key = '' + group + '_' + name;
        if (type != StatCounterTypeV1.Total) 
            key = key + '_' + StatCounterKeyGenerator.makeCounterTime(type, time);
        return key;
    }

}