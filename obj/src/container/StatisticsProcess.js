"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const StatisticsFactory_1 = require("../build/StatisticsFactory");
class StatisticsProcess extends pip_services_container_node_1.ProcessContainer {
    initReferences(references) {
        super.initReferences(references);
        // Factory to statically resolve statistics components
        references.put(StatisticsFactory_1.StatisticsFactory.Descriptor, new StatisticsFactory_1.StatisticsFactory());
    }
    runWithArguments(args) {
        return this.runWithArgumentsOrConfigFile("statistics", args, "./config/config.yaml");
    }
}
exports.StatisticsProcess = StatisticsProcess;
//# sourceMappingURL=StatisticsProcess.js.map