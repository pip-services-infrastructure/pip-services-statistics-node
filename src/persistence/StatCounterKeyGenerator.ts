let moment = require('moment-timezone');

import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';

export class StatCounterKeyGenerator {

    public static makeCounterTime(type: StatCounterTypeV1,
        time: Date, timezone: string): number {
        let result = 0;

        let tz = timezone || 'UTC';
        let t = moment(time).tz(tz);

        if (type != StatCounterTypeV1.Total) {
            result = t.year();

            if (type != StatCounterTypeV1.Year) {
                result = result * 100 + t.month() + 1;
                if (type != StatCounterTypeV1.Month) {
                    result = result * 100 + t.date();
                    if (type != StatCounterTypeV1.Day) {
                        result = result * 100 + t.hour();
                    }
                }
            }
        }

        return result;
    }

    public static makeCounterKey(group: string, name: string, type: StatCounterTypeV1,
        time: Date, timezone: string): string {
        let key = '' + group + '_' + name;
        if (type != StatCounterTypeV1.Total) 
            key = key + '_' + StatCounterKeyGenerator.makeCounterTime(type, time, timezone);
        return key;
    }

}