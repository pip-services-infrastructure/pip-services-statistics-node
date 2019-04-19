"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class StatCounterV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('group', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('name', pip_services3_commons_node_2.TypeCode.String);
    }
}
exports.StatCounterV1Schema = StatCounterV1Schema;
//# sourceMappingURL=StatCounterV1Schema.js.map