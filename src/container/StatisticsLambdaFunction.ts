import { Descriptor } from 'pip-services-commons-node';
import { CommandableLambdaFunction } from 'pip-services-aws-node';

import { StatisticsServiceFactory } from '../build/StatisticsServiceFactory';

export class StatisticsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("statistics", "Statistics function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-statistics', 'controller', 'default', '*', '*'));
        this._factories.add(new StatisticsServiceFactory());
    }
}

export const handler = new StatisticsLambdaFunction().getHandler();