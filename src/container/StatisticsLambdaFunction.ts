import { Descriptor } from 'pip-services-commons-node';
import { CommandableLambdaFunction } from 'pip-services-aws-node';
import { DefaultNetFactory } from 'pip-services-net-node';
import { DefaultOssFactory } from 'pip-services-oss-node';

import { StatisticsServiceFactory } from '../build/StatisticsServiceFactory';

export class StatisticsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("statistics", "Statistics function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-statistics', 'controller', 'default', '*', '*'));
        this._factories.add(new StatisticsServiceFactory());
        this._factories.add(new DefaultNetFactory);
        this._factories.add(new DefaultOssFactory);
    }
}

export const handler = new StatisticsLambdaFunction().getHandler();