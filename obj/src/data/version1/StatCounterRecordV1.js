"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatCounterTypeV1_1 = require("./StatCounterTypeV1");
class StatCounterRecordV1 {
    constructor(group, name, type, time, value) {
        this.group = group;
        this.name = name;
        this.type = type;
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total) {
            this.year = time.getUTCFullYear();
            if (type != StatCounterTypeV1_1.StatCounterTypeV1.Year) {
                this.month = time.getUTCMonth() + 1;
                if (type != StatCounterTypeV1_1.StatCounterTypeV1.Month) {
                    this.day = time.getUTCDate();
                    if (type != StatCounterTypeV1_1.StatCounterTypeV1.Day) {
                        this.hour = time.getUTCHours();
                    }
                }
            }
        }
        this.value = value;
    }
}
exports.StatCounterRecordV1 = StatCounterRecordV1;
//# sourceMappingURL=StatCounterRecordV1.js.map