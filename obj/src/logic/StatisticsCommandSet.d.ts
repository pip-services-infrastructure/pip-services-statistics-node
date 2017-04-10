import { CommandSet } from 'pip-services-commons-node';
import { IStatisticsBusinessLogic } from './IStatisticsBusinessLogic';
export declare class StatisticsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IStatisticsBusinessLogic);
    private makeGetContersCommand();
    private makeIncrementCounterCommand();
    private makeReadOneCounterCommand();
    private makeReadCountersCommand();
}
