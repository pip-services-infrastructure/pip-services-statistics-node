import { Descriptor } from 'pip-services-commons-node';
import { CommandableHttpService } from 'pip-services-net-node';

export class StatisticsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/statistics');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-statistics', 'controller', 'default', '*', '1.0'));
    }
}