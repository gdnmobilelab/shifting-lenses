import Inferno from 'inferno';
import Routes from '../shared/routes';
import { Router } from 'inferno-router';
import createHistory from 'history/createBrowserHistory';
import {setRunFunction} from '../shared/util/run-command';
import runServiceWorkerCommand from 'service-worker-command-bridge/client';
import { ServiceWorkerNotSupportedError } from '../shared/util/errors';
//DEVTOOLSINSERT

if (navigator.serviceWorker) {
    setRunFunction(runServiceWorkerCommand);
} else {
    setRunFunction(function() {
        return Promise.reject(new ServiceWorkerNotSupportedError())
    })
}

Inferno.render(
    <Router history={createHistory()}>{Routes}</Router>,
    document.getElementById('main')
);

console.log('client active')