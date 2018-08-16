"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_commons_node_1 = require("pip-services-commons-node");
const StatisticsMongoDbPersistence_1 = require("../persistence/StatisticsMongoDbPersistence");
const StatisticsFilePersistence_1 = require("../persistence/StatisticsFilePersistence");
const StatisticsMemoryPersistence_1 = require("../persistence/StatisticsMemoryPersistence");
const StatisticsController_1 = require("../logic/StatisticsController");
const StatisticsHttpServiceV1_1 = require("../services/version1/StatisticsHttpServiceV1");
const StatisticsSenecaServiceV1_1 = require("../services/version1/StatisticsSenecaServiceV1");
class StatisticsServiceFactory extends pip_services_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(StatisticsServiceFactory.MemoryPersistenceDescriptor, StatisticsMemoryPersistence_1.StatisticsMemoryPersistence);
        this.registerAsType(StatisticsServiceFactory.FilePersistenceDescriptor, StatisticsFilePersistence_1.StatisticsFilePersistence);
        this.registerAsType(StatisticsServiceFactory.MongoDbPersistenceDescriptor, StatisticsMongoDbPersistence_1.StatisticsMongoDbPersistence);
        this.registerAsType(StatisticsServiceFactory.ControllerDescriptor, StatisticsController_1.StatisticsController);
        this.registerAsType(StatisticsServiceFactory.SenecaServiceDescriptor, StatisticsSenecaServiceV1_1.StatisticsSenecaServiceV1);
        this.registerAsType(StatisticsServiceFactory.HttpServiceDescriptor, StatisticsHttpServiceV1_1.StatisticsHttpServiceV1);
    }
}
StatisticsServiceFactory.Descriptor = new pip_services_commons_node_1.Descriptor("pip-services-statistics", "factory", "default", "default", "1.0");
StatisticsServiceFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-statistics", "persistence", "memory", "*", "1.0");
StatisticsServiceFactory.FilePersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-statistics", "persistence", "file", "*", "1.0");
StatisticsServiceFactory.MongoDbPersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-statistics", "persistence", "mongodb", "*", "1.0");
StatisticsServiceFactory.ControllerDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-statistics", "controller", "default", "*", "1.0");
StatisticsServiceFactory.SenecaServiceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-statistics", "service", "seneca", "*", "1.0");
StatisticsServiceFactory.HttpServiceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-statistics", "service", "http", "*", "1.0");
exports.StatisticsServiceFactory = StatisticsServiceFactory;
//# sourceMappingURL=StatisticsServiceFactory.js.map