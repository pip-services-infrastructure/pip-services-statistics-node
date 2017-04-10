"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatCounterTypeV1_1 = require("../data/version1/StatCounterTypeV1");
class StatCounterKeyGenerator {
    static makeCounterTime(type, time) {
        let result = 0;
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total) {
            result = time.getUTCFullYear();
            if (type != StatCounterTypeV1_1.StatCounterTypeV1.Year) {
                result = result * 100 + time.getUTCMonth() + 1;
                if (type != StatCounterTypeV1_1.StatCounterTypeV1.Month) {
                    result = result * 100 + time.getUTCDate();
                    if (type != StatCounterTypeV1_1.StatCounterTypeV1.Day) {
                        result = result * 100 + time.getUTCHours();
                    }
                }
            }
        }
        return result;
    }
    static makeCounterKey(group, name, type, time) {
        let key = '' + group + '_' + name;
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total)
            key = key + '_' + StatCounterKeyGenerator.makeCounterTime(type, time);
        return key;
    }
}
exports.StatCounterKeyGenerator = StatCounterKeyGenerator;
//# sourceMappingURL=StatCounterKeyGenerator.js.map