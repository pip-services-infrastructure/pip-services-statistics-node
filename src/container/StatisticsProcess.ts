import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { StatisticsFactory } from '../build/StatisticsFactory';

export class StatisticsProcess extends ProcessContainer {

    protected initReferences(references: IReferences): void {
        super.initReferences(references);

        // Factory to statically resolve statistics components
        references.put(StatisticsFactory.Descriptor, new StatisticsFactory());
    }

    public runWithArguments(args: string[]): void {
        return this.runWithArgumentsOrConfigFile("statistics", args, "./config/config.yaml");
    }

}
