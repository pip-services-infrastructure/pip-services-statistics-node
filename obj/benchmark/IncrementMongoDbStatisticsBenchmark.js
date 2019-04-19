"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const StatisticsMongoDbPersistence_1 = require("../src/persistence/StatisticsMongoDbPersistence");
const StatisticsController_1 = require("../src/logic/StatisticsController");
class IncrementMongoDbStatisticsBenchmark extends pip_benchmark_node_1.Benchmark {
    constructor() {
        super("IncrementMongoDbStatistics", "Measures performance of incrementing counters into MongoDB database");
    }
    setUp(callback) {
        this._initialRecordNumber = this.context.parameters.InitialRecordNumber.getAsInteger();
        this._counterNumber = this.context.parameters.CounterNumber.getAsInteger();
        this._iterationNumber = this.context.parameters.IterationNumber.getAsInteger();
        let mongoUri = this.context.parameters.MongoUri.getAsString();
        let mongoHost = this.context.parameters.MongoHost.getAsString();
        let mongoPort = this.context.parameters.MongoPort.getAsInteger();
        let mongoDb = this.context.parameters.MongoDb.getAsString();
        this._persistence = new StatisticsMongoDbPersistence_1.StatisticsMongoDbPersistence();
        this._persistence.configure(pip_services3_commons_node_1.ConfigParams.fromTuples('connection.uri', mongoUri, 'connection.host', mongoHost, 'connection.port', mongoPort, 'connection.database', mongoDb));
        this._controller = new StatisticsController_1.StatisticsController();
        // this._controller.configure(ConfigParams.fromTuples(
        //     'options.interval', 5 // Set interval to 5 mins
        // ));
        let references = pip_services3_commons_node_3.References.fromTuples(new pip_services3_commons_node_2.Descriptor('pip-services-statistics', 'persistence', 'mongodb', 'default', '1.0'), this._persistence, new pip_services3_commons_node_2.Descriptor('pip-services-statistics', 'controller', 'default', 'default', '1.0'), this._controller);
        this._controller.setReferences(references);
        this._persistence.open(null, (err) => {
            if (err == null)
                this.context.sendMessage('Connected to mongodb database');
            callback(err);
        });
    }
    tearDown(callback) {
        this._persistence.close(null, (err) => {
            this.context.sendMessage('Disconnected from mongodb database');
            callback(err);
        });
        this._persistence = null;
        this._controller = null;
    }
    getRandomCounter() {
        return Math.trunc(Math.random() * this._counterNumber).toString();
    }
    // public execute(callback: (err: any) => void): void {
    //     this._controller.incrementCounter(
    //         null, "test", this.getRandomCounter(), new Date(), "UTC", 1,
    //         (err) => {
    //             callback(err);
    //         }
    //     );
    // }
    execute(callback) {
        let increments = [];
        for (let iteration = 1; iteration <= this._iterationNumber; iteration++) {
            let now = new Date();
            for (let counter = 1; counter <= this._counterNumber; counter++) {
                increments.push({
                    group: 'test',
                    name: counter.toString(),
                    time: now,
                    value: 1
                });
            }
        }
        this._controller.incrementCounters(null, increments, callback);
    }
}
exports.IncrementMongoDbStatisticsBenchmark = IncrementMongoDbStatisticsBenchmark;
//# sourceMappingURL=IncrementMongoDbStatisticsBenchmark.js.map