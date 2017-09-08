import { ObjectSchema } from 'pip-services-commons-node';
import { TypeCode } from 'pip-services-commons-node';

export class StatCounterIncrementV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('group', TypeCode.String);
        this.withRequiredProperty('name', TypeCode.String);
        this.withOptionalProperty('time', null); //TypeCode.DateTime);
        this.withOptionalProperty('timezone', TypeCode.Float);
        this.withRequiredProperty('value', TypeCode.Float);
    }
}