const tasks = require('./gobblefile');
const workerProxy = require('node-service-worker-proxy');
const log = require('node-service-worker-proxy/src/log');
const fetch = require('node-fetch');
const { Writable } = require('stream');
require('colors');

// remove console logging
log.streams.pop();

let logStream = new Writable({
    objectMode: true,
    write: function(chunk, encoding, next) {
        
        let subtask = chunk.subtask || "proxy";

        let output = [
            (subtask + ":\t").blue,
            chunk.msg
        ]

        if (chunk.args) {
            chunk = chunk.args;
        }
        let filterOut = [
            'name',
            'hostname',
            'pid',
            'subtask',
            'level',
            'time',
            'v'
        ]

        filterOut.forEach((key) => chunk[key] = undefined)

        if (Object.keys(chunk).length > 0) {

            let indented = JSON.stringify(chunk, null, 2)
                .split('\n')
                .map((v) => '\t' + v)
                .join('\n')


            output.push("\n" + indented.dim)
        }

        console.log(output.join(""))

        next();
    }
});



log.addStream({
    level: 'info',
    type: 'raw',
    stream: logStream
})

const server = tasks.serve({
    port: 4566
});

let gobbleLog = log.child({subtask: 'gobble'});
let workerLog = log.child({subtask: 'worker'});

function logMap(level) {
    return function(obj) {
        let text = obj.code;
        delete obj.code;
        gobbleLog[level](obj, text);
    }
}



let existingWorker = null;

let shouldReloadWorker = true;

server.on('info', (e) => {
    if (e.code !== "BUILD_INVALIDATED") {
        return
    }

    let changedFilesInSWJS = e.changes.some((change) => {
        return change.file.indexOf("shared/") > -1 || change.file.indexOf("sw/") > -1
    })

    shouldReloadWorker = changedFilesInSWJS;
})


server.on('built', function(e) {
    if (shouldReloadWorker === false) {
        log.info("Not reloading service worker")
        return
    }
    Promise.resolve()
    .then(() => {
        if (existingWorker) {
            log.info("Destroying old service worker proxy");
            return existingWorker.stop();
        }
        
        return false;
    })
    .then(() => {
        return workerProxy({
            source: 'http://localhost:4566',
            target: 'http://localhost:4567',
            port: 4567,
            worker: 'inauguration/sw.js'
        })
        
    })
    .then((workerServer) => {
        existingWorker = workerServer;
        workerServer.worker.globalScope.console.on('log', function() {

            let args = Array.from(arguments);
            let label = args.shift();

            workerLog.info({args},label);
        })
        log.info("New worker proxy created")
    })
    .catch((err) => {
        log.error(err);
    })
})

server.on('info', logMap('info'));
server.on('error', logMap('error'));
server.on('warning', logMap('warn'));