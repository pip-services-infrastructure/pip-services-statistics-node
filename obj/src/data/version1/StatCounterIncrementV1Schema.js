"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class StatCounterIncrementV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('group', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('name', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('timezone', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('value', pip_services3_commons_node_2.TypeCode.Float);
    }
}
exports.StatCounterIncrementV1Schema = StatCounterIncrementV1Schema;
//# sourceMappingURL=StatCounterIncrementV1Schema.js.map