let StatisticsProcess = require('../obj/src/container/StatisticsProcess').StatisticsProcess;

try {
    new StatisticsProcess().runWithArguments(process.argv);
} catch (ex) {
    console.error(ex);
}
