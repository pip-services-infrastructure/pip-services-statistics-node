let _ = require('lodash');
let moment = require('moment-timezone');

import { IStringIdentifiable } from 'pip-services-commons-node';
import { StatCounterTypeV1 } from './StatCounterTypeV1';

export class StatCounterRecordV1 implements IStringIdentifiable {
    public id: string;
    public group: string;
    public name: string;
    public type: StatCounterTypeV1;
    public year?: number;
    public month?: number;
    public day?: number;
    public hour?: number;
    public value: number;
}