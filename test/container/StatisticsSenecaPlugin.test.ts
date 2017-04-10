let _ = require('lodash');
let assert = require('chai').assert;

let pluginOptions = {
    logger: {
        level: 'debug'
    },
    persistence: {
        type: 'memory'
    },
    service: {
        connection: {
            protocol: 'none'
        }
    }
};

suite('StatisticsSenecaPlugin', ()=> {
    let seneca;

    suiteSetup((done) => {
        seneca = require('seneca')({ strict: { result: false } });

        // Load Seneca plugin
        let plugin = require('../../src/container/StatisticsSenecaPlugin');
        seneca.use(plugin, pluginOptions);

        seneca.ready(done);
    });

    suiteTeardown((done) => {
        seneca.close(done);
    });

    test('Ping', (done) => {
        seneca.act(
            {
                role: 'statistics',
                cmd: 'get_counters' 
            },
            (err, page) => {
                assert.isNull(err);
                assert.isObject(page);
                done();
            }
        );
    });
});