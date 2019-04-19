import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class StatCounterV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('group', TypeCode.String);
        this.withRequiredProperty('name', TypeCode.String);
    }
}