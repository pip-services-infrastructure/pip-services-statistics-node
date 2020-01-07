// import { ConfigParams } from 'pip-services3-commons-node';

// import { StatisticsFilePersistence } from '../../src/persistence/StatisticsFilePersistence';
// import { StatisticsPersistenceFixture } from './StatisticsPersistenceFixture';

// suite('StatisticsFilePersistence', ()=> {
//     let persistence: StatisticsFilePersistence;
//     let fixture: StatisticsPersistenceFixture;
    
//     setup((done) => {
//         persistence = new StatisticsFilePersistence('./data/statistics.test.json');

//         fixture = new StatisticsPersistenceFixture(persistence);
        
//         persistence.open(null, (err) => {
//             if (err) done(err);
//             else persistence.clear(null, done);
//         });
//     });
    
//     teardown((done) => {
//         persistence.close(null, done);
//     });
        
//     test('CRUD Operations', (done) => {
//         fixture.testCrudOperations(done);
//     });
// });