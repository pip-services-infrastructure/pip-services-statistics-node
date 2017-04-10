"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
class StatisticsSenecaServiceV1 extends pip_services_net_node_1.CommandableSenecaService {
    constructor() {
        super('statistics');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-statistics', 'controller', 'default', '*', '1.0'));
    }
}
exports.StatisticsSenecaServiceV1 = StatisticsSenecaServiceV1;
//# sourceMappingURL=StatisticsSenecaServiceV1.js.map