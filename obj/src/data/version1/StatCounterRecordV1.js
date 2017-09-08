"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let moment = require('moment-timezone');
const StatCounterTypeV1_1 = require("./StatCounterTypeV1");
class StatCounterRecordV1 {
    constructor(group, name, type, time, timezone, value) {
        this.group = group;
        this.name = name;
        this.type = type;
        let tz = timezone || 'UTC';
        let t = moment(time).tz(tz);
        if (type != StatCounterTypeV1_1.StatCounterTypeV1.Total) {
            this.year = t.year();
            if (type != StatCounterTypeV1_1.StatCounterTypeV1.Year) {
                this.month = t.month() + 1;
                if (type != StatCounterTypeV1_1.StatCounterTypeV1.Month) {
                    this.day = t.date();
                    if (type != StatCounterTypeV1_1.StatCounterTypeV1.Day) {
                        this.hour = t.hour();
                    }
                }
            }
        }
        this.value = value;
    }
}
exports.StatCounterRecordV1 = StatCounterRecordV1;
//# sourceMappingURL=StatCounterRecordV1.js.map