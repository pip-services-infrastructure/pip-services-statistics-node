"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const StatisticsServiceFactory_1 = require("../build/StatisticsServiceFactory");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
class StatisticsProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("statistics", "Statistics microservice");
        this._factories.add(new StatisticsServiceFactory_1.StatisticsServiceFactory);
        this._factories.add(new pip_services_rpc_node_1.DefaultRpcFactory);
    }
}
exports.StatisticsProcess = StatisticsProcess;
//# sourceMappingURL=StatisticsProcess.js.map