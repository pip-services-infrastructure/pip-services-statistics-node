// import { StatisticsMemoryPersistence } from '../../src/persistence/StatisticsMemoryPersistence';
// import { StatisticsPersistenceFixture } from './StatisticsPersistenceFixture';

// suite('StatisticsMemoryPersistence', ()=> {
//     let persistence: StatisticsMemoryPersistence;
//     let fixture: StatisticsPersistenceFixture;
    
//     setup((done) => {
//         persistence = new StatisticsMemoryPersistence();
//         fixture = new StatisticsPersistenceFixture(persistence);
        
//         persistence.open(null, done);
//     });
    
//     teardown((done) => {
//         persistence.close(null, done);
//     });
        
//     test('CRUD Operations', (done) => {
//         fixture.testCrudOperations(done);
//     });

// });