import {runCommand} from '../../util/run-command';
import browser from '../../util/browser';
import Component from 'inferno-component';
import {appDownloadComponent} from '../shell/app-shell';
import {FeatureNotSupportedError, ServiceWorkerNotSupportedError} from '../../util/errors';
import checkNotificationPermission from '../../util/check-notification-permission';


export default class VideoNotificationSignup extends Component {

    constructor() {
        super()
        this.state = {
            show: false
        }
    }

    runSignup() {
        Promise.resolve()
        .then(() => {
            if (!('Notification' in window) || !('video' in Notification.prototype)) {
                throw new FeatureNotSupportedError();
            }

            return checkNotificationPermission()
        })
        .then(() => {
            return runCommand('live-video-notification.signup')
        })
        .catch((err) => {
            if (err instanceof ServiceWorkerNotSupportedError || err instanceof FeatureNotSupportedError) {
                appDownloadComponent.show();
            }
            console.log(err)
        })
    }

    render() {
        if (this.state.show === false) {
            return null;
        }

        return <div class='notify-thing'>
            <p>Blah blah blah, things and stuff, sign up for a live video notification.</p>
            <div class='button-holder right-align'>
                <button onClick={this.runSignup}>Sign me up</button>
            </div>
        </div>
    }

    componentDidMount() {
        if (browser().iOS === true) {
            this.setState({
                show: true
            })
        }
    }
    
}

