import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';
import { DefaultNetFactory } from 'pip-services-net-node';
import { DefaultOssFactory } from 'pip-services-oss-node';

import { StatisticsServiceFactory } from '../build/StatisticsServiceFactory';

export class StatisticsProcess extends ProcessContainer {

    public constructor() {
        super("statistics", "Statistics microservice");
        this._factories.add(new StatisticsServiceFactory);
        this._factories.add(new DefaultNetFactory);
        this._factories.add(new DefaultOssFactory);
    }


}
