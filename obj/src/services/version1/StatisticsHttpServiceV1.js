"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class StatisticsHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/statistics');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-statistics', 'controller', 'default', '*', '1.0'));
    }
}
exports.StatisticsHttpServiceV1 = StatisticsHttpServiceV1;
//# sourceMappingURL=StatisticsHttpServiceV1.js.map