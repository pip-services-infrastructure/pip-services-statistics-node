let moment = require('moment-timezone');

import { IStringIdentifiable } from 'pip-services-commons-node';
import { StatCounterTypeV1 } from './StatCounterTypeV1';

export class StatCounterRecordV1 implements IStringIdentifiable {

    public constructor(group: string, name: string, type: StatCounterTypeV1,
        time: Date, timezone: string, value: number) {
        this.group = group;
        this.name = name;
        this.type = type;
        
        let tz = timezone || 'UTC';
        let t = moment(time).tz(tz);

        if (type != StatCounterTypeV1.Total) {
            this.year = t.year();
            if (type != StatCounterTypeV1.Year) {
                this.month = t.month() + 1;
                if (type != StatCounterTypeV1.Month) {
                    this.day = t.date();
                    if (type != StatCounterTypeV1.Day) {
                        this.hour = t.hour();
                    }
                }
            }
        }
        this.value = value;
    }

    public id: string;
    public group: string;
    public name: string;
    public type: StatCounterTypeV1;
    public year: number;
    public month: number;
    public day: number;
    public hour: number;
    public value: number;
}