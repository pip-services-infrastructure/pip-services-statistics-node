"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const StatisticsMongoDbPersistence_1 = require("../persistence/StatisticsMongoDbPersistence");
const StatisticsFilePersistence_1 = require("../persistence/StatisticsFilePersistence");
const StatisticsMemoryPersistence_1 = require("../persistence/StatisticsMemoryPersistence");
const StatisticsController_1 = require("../logic/StatisticsController");
const StatisticsHttpServiceV1_1 = require("../services/version1/StatisticsHttpServiceV1");
const StatisticsSenecaServiceV1_1 = require("../services/version1/StatisticsSenecaServiceV1");
class StatisticsFactory extends pip_services_commons_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(StatisticsFactory.MemoryPersistenceDescriptor, StatisticsMemoryPersistence_1.StatisticsMemoryPersistence);
        this.registerAsType(StatisticsFactory.FilePersistenceDescriptor, StatisticsFilePersistence_1.StatisticsFilePersistence);
        this.registerAsType(StatisticsFactory.MongoDbPersistenceDescriptor, StatisticsMongoDbPersistence_1.StatisticsMongoDbPersistence);
        this.registerAsType(StatisticsFactory.ControllerDescriptor, StatisticsController_1.StatisticsController);
        this.registerAsType(StatisticsFactory.SenecaServiceDescriptor, StatisticsSenecaServiceV1_1.StatisticsSenecaServiceV1);
        this.registerAsType(StatisticsFactory.HttpServiceDescriptor, StatisticsHttpServiceV1_1.StatisticsHttpServiceV1);
    }
}
StatisticsFactory.Descriptor = new pip_services_commons_node_2.Descriptor("pip-services-statistics", "factory", "default", "default", "1.0");
StatisticsFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-statistics", "persistence", "memory", "*", "1.0");
StatisticsFactory.FilePersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-statistics", "persistence", "file", "*", "1.0");
StatisticsFactory.MongoDbPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-statistics", "persistence", "mongodb", "*", "1.0");
StatisticsFactory.ControllerDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-statistics", "controller", "default", "*", "1.0");
StatisticsFactory.SenecaServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-statistics", "service", "seneca", "*", "1.0");
StatisticsFactory.HttpServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-statistics", "service", "http", "*", "1.0");
exports.StatisticsFactory = StatisticsFactory;
//# sourceMappingURL=StatisticsFactory.js.map