"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
class StatCounterIncrementV1Schema extends pip_services_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('group', pip_services_commons_node_2.TypeCode.String);
        this.withRequiredProperty('name', pip_services_commons_node_2.TypeCode.String);
        this.withRequiredProperty('time', null); //TypeCode.DateTime);
        this.withRequiredProperty('value', pip_services_commons_node_2.TypeCode.Float);
    }
}
exports.StatCounterIncrementV1Schema = StatCounterIncrementV1Schema;
//# sourceMappingURL=StatCounterIncrementV1Schema.js.map