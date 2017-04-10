import { Descriptor } from 'pip-services-commons-node';
import { CommandableSenecaService } from 'pip-services-net-node';

export class StatisticsSenecaServiceV1 extends CommandableSenecaService {
    public constructor() {
        super('statistics');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-statistics', 'controller', 'default', '*', '1.0'));
    }
}