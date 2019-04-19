import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { StatisticsServiceFactory } from '../build/StatisticsServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class StatisticsProcess extends ProcessContainer {

    public constructor() {
        super("statistics", "Statistics microservice");
        this._factories.add(new StatisticsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }


}
