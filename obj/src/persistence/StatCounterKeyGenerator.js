"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let moment = require('moment-timezone');
const StatCounterTypeV1_1 = require("../data/version1/StatCounterTypeV1");
class StatCounterKeyGenerator {
    static makeCounterTime(type, momentTime) {
        let result = 0;
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total) {
            result = momentTime.year();
            if (type != StatCounterTypeV1_1.StatCounterTypeV1.Year) {
                result = result * 100 + momentTime.month() + 1;
                if (type != StatCounterTypeV1_1.StatCounterTypeV1.Month) {
                    result = result * 100 + momentTime.date();
                    if (type != StatCounterTypeV1_1.StatCounterTypeV1.Day) {
                        result = result * 100 + momentTime.hour();
                    }
                }
            }
        }
        return result;
    }
    static makeCounterKeyFromMoment(group, name, type, momentTime) {
        let key = '' + group + '_' + name;
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total)
            key = key + '_' + StatCounterKeyGenerator.makeCounterTime(type, momentTime);
        return key;
    }
    static makeCounterKeyFromTime(group, name, type, time, timezone) {
        let tz = timezone || 'UTC';
        let momentTime = moment(time).tz(tz);
        return StatCounterKeyGenerator.makeCounterKeyFromMoment(group, name, type, momentTime);
    }
}
exports.StatCounterKeyGenerator = StatCounterKeyGenerator;
//# sourceMappingURL=StatCounterKeyGenerator.js.map