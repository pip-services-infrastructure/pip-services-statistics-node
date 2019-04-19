import { Benchmark } from 'pip-benchmark-node';
import { DateTimeConverter } from 'pip-services3-commons-node';

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { StatCounterIncrementV1 } from '../src/data/version1/StatCounterIncrementV1';
import { StatisticsMongoDbPersistence } from '../src/persistence/StatisticsMongoDbPersistence';
import { StatisticsController } from '../src/logic/StatisticsController';

export class IncrementMongoDbStatisticsBenchmark extends Benchmark {
    private _initialRecordNumber: number;
    private _counterNumber: number;
    private _iterationNumber: number;

    private _persistence: StatisticsMongoDbPersistence;
    private _controller: StatisticsController;

    public constructor() {
        super("IncrementMongoDbStatistics", "Measures performance of incrementing counters into MongoDB database");
    }

    public setUp(callback: (err: any) => void): void {
        this._initialRecordNumber = this.context.parameters.InitialRecordNumber.getAsInteger();
        this._counterNumber = this.context.parameters.CounterNumber.getAsInteger();
        this._iterationNumber = this.context.parameters.IterationNumber.getAsInteger();
        
        let mongoUri = this.context.parameters.MongoUri.getAsString();
        let mongoHost = this.context.parameters.MongoHost.getAsString();
        let mongoPort = this.context.parameters.MongoPort.getAsInteger();
        let mongoDb = this.context.parameters.MongoDb.getAsString();

        this._persistence = new StatisticsMongoDbPersistence();
        this._persistence.configure(ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDb
        ));

        this._controller = new StatisticsController();
        // this._controller.configure(ConfigParams.fromTuples(
        //     'options.interval', 5 // Set interval to 5 mins
        // ));

        let references: References = References.fromTuples(
            new Descriptor('pip-services-statistics', 'persistence', 'mongodb', 'default', '1.0'), this._persistence,
            new Descriptor('pip-services-statistics', 'controller', 'default', 'default', '1.0'), this._controller
        );
        this._controller.setReferences(references);

        this._persistence.open(null, (err) => {
            if (err == null)
                this.context.sendMessage('Connected to mongodb database');
            callback(err);
        });
    }

    public tearDown(callback: (err: any) => void): void {
        this._persistence.close(null, (err) => {
            this.context.sendMessage('Disconnected from mongodb database');
            callback(err);
        });

        this._persistence = null;
        this._controller = null;
    }

    private getRandomCounter(): string {
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

    public execute(callback: (err: any) => void): void {
        let increments: StatCounterIncrementV1[] = [];

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