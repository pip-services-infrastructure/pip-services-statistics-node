import { IStringIdentifiable } from 'pip-services-commons-node';
import { StatCounterTypeV1 } from './StatCounterTypeV1';

export class StatCounterRecordV1 implements IStringIdentifiable {

    public constructor(group: string, name: string, 
        type: StatCounterTypeV1, time: Date, value: number) {
        this.group = group;
        this.name = name;
        this.type = type;
        if (type != StatCounterTypeV1.Total) {
            this.year = time.getUTCFullYear();
            if (type != StatCounterTypeV1.Year) {
                this.month = time.getUTCMonth() + 1;
                if (type != StatCounterTypeV1.Month) {
                    this.day = time.getUTCDate();
                    if (type != StatCounterTypeV1.Day) {
                        this.hour = time.getUTCHours();
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