import { YamlConfigReader } from 'pip-services-commons-node';

import { StatisticsMongoDbPersistence } from '../../src/persistence/StatisticsMongoDbPersistence';
import { StatisticsPersistenceFixture } from './StatisticsPersistenceFixture';

suite('StatisticsMongoDbPersistence', ()=> {
    let persistence: StatisticsMongoDbPersistence;
    let fixture: StatisticsPersistenceFixture;

    setup((done) => {
        let config = YamlConfigReader.readConfig(null, './config/test_connections.yaml');
        let dbConfig = config.getSection('mongodb');

        persistence = new StatisticsMongoDbPersistence();
        persistence.configure(dbConfig);

        fixture = new StatisticsPersistenceFixture(persistence);

        persistence.open(null, (err: any) => {
            persistence.clear(null, (err) => {
                done(err);
            });
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});