"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let moment = require('moment-timezone');
const StatCounterTypeV1_1 = require("../data/version1/StatCounterTypeV1");
class StatCounterKeyGenerator {
    static makeCounterTime(type, time, timezone) {
        let result = 0;
        let tz = timezone || 'UTC';
        let t = moment(time).tz(tz);
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total) {
            result = t.year();
            if (type != StatCounterTypeV1_1.StatCounterTypeV1.Year) {
                result = result * 100 + t.month() + 1;
                if (type != StatCounterTypeV1_1.StatCounterTypeV1.Month) {
                    result = result * 100 + t.date();
                    if (type != StatCounterTypeV1_1.StatCounterTypeV1.Day) {
                        result = result * 100 + t.hour();
                    }
                }
            }
        }
        return result;
    }
    static makeCounterKey(group, name, type, time, timezone) {
        let key = '' + group + '_' + name;
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total)
            key = key + '_' + StatCounterKeyGenerator.makeCounterTime(type, time, timezone);
        return key;
    }
}
exports.StatCounterKeyGenerator = StatCounterKeyGenerator;
//# sourceMappingURL=StatCounterKeyGenerator.js.map