import './fetch-handler.js'
import {setConfig as setPushkinConfig} from 'pushkin-client';
import config from '../config';
import {setRunFunction} from '../shared/util/run-command'
import commandBridge from 'service-worker-command-bridge/service-worker';
import {subscribe, isSubscribed} from './live-video-notification';

// setRunFunction(commandBridge.)

setPushkinConfig(config.pushkin);

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) => {
    console.log("claiming clients")
    self.clients.claim()
});

commandBridge.bind('live-video-notification.signup', subscribe);
commandBridge.bind('live-video-notification.is-subscribed', isSubscribed);