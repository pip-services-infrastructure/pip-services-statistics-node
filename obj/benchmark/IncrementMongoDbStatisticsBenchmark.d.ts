import { Benchmark } from 'pip-benchmark-node';
export declare class IncrementMongoDbStatisticsBenchmark extends Benchmark {
    private _initialRecordNumber;
    private _counterNumber;
    private _iterationNumber;
    private _persistence;
    private _controller;
    constructor();
    setUp(callback: (err: any) => void): void;
    tearDown(callback: (err: any) => void): void;
    private getRandomCounter();
    execute(callback: (err: any) => void): void;
}
