"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_commons_node_5 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_net_node_2 = require("pip-services-net-node");
const StatisticsMemoryPersistence_1 = require("../persistence/StatisticsMemoryPersistence");
const StatisticsFilePersistence_1 = require("../persistence/StatisticsFilePersistence");
const StatisticsMongoDbPersistence_1 = require("../persistence/StatisticsMongoDbPersistence");
const StatisticsController_1 = require("../logic/StatisticsController");
const StatisticsSenecaServiceV1_1 = require("../services/version1/StatisticsSenecaServiceV1");
class StatisticsSenecaPlugin extends pip_services_net_node_1.SenecaPlugin {
    constructor(seneca, options) {
        super('pip-services-statistics', seneca, StatisticsSenecaPlugin.createReferences(seneca, options));
    }
    static createReferences(seneca, options) {
        options = options || {};
        let logger = new pip_services_commons_node_4.ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(pip_services_commons_node_3.ConfigParams.fromValue(loggerOptions));
        let controller = new StatisticsController_1.StatisticsController();
        let persistence;
        let persistenceOptions = options.persistence || {};
        let persistenceType = persistenceOptions.type || 'memory';
        if (persistenceType == 'mongodb')
            persistence = new StatisticsMongoDbPersistence_1.StatisticsMongoDbPersistence();
        else if (persistenceType == 'file')
            persistence = new StatisticsFilePersistence_1.StatisticsFilePersistence();
        else if (persistenceType == 'memory')
            persistence = new StatisticsMemoryPersistence_1.StatisticsMemoryPersistence();
        else
            throw new pip_services_commons_node_5.ConfigException(null, 'WRONG_PERSISTENCE_TYPE', 'Unrecognized persistence type: ' + persistenceType);
        persistence.configure(pip_services_commons_node_3.ConfigParams.fromValue(persistenceOptions));
        let senecaInstance = new pip_services_net_node_2.SenecaInstance(seneca);
        let service = new StatisticsSenecaServiceV1_1.StatisticsSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(pip_services_commons_node_3.ConfigParams.fromValue(serviceOptions));
        return pip_services_commons_node_1.References.fromTuples(new pip_services_commons_node_2.Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger, new pip_services_commons_node_2.Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaInstance, new pip_services_commons_node_2.Descriptor('pip-services-statistics', 'persistence', persistenceType, 'default', '1.0'), persistence, new pip_services_commons_node_2.Descriptor('pip-services-statistics', 'controller', 'default', 'default', '1.0'), controller, new pip_services_commons_node_2.Descriptor('pip-services-statistics', 'service', 'seneca', 'default', '1.0'), service);
    }
}
exports.StatisticsSenecaPlugin = StatisticsSenecaPlugin;
module.exports = function (options) {
    let seneca = this;
    let plugin = new StatisticsSenecaPlugin(seneca, options);
    return { name: plugin.name };
};
//# sourceMappingURL=StatisticsSenecaPlugin.js.map