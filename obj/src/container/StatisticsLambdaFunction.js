"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_aws_node_1 = require("pip-services-aws-node");
const StatisticsServiceFactory_1 = require("../build/StatisticsServiceFactory");
class StatisticsLambdaFunction extends pip_services_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("statistics", "Statistics function");
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-statistics', 'controller', 'default', '*', '*'));
        this._factories.add(new StatisticsServiceFactory_1.StatisticsServiceFactory());
    }
}
exports.StatisticsLambdaFunction = StatisticsLambdaFunction;
exports.handler = new StatisticsLambdaFunction().getHandler();
//# sourceMappingURL=StatisticsLambdaFunction.js.map