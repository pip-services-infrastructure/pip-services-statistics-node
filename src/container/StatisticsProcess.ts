import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { StatisticsServiceFactory } from '../build/StatisticsServiceFactory';

export class StatisticsProcess extends ProcessContainer {

    public constructor() {
        super("statistics", "Statistics microservice");
        this._factories.add(new StatisticsServiceFactory);
    }


}
