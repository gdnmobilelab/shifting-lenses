import Lens from '../shifting-lenses/lens';
import Component from 'inferno-component';
import {runCommand} from '../../util/run-command';
import VideoNotificationSignup from '../blocks/video-notification-signup';

export default class LiveVideoLens extends Component {
    render() {
        return <div class='lens liveblog-lens'>
            <h5><span class='live-blob'/> Live blog</h5>
            <VideoNotificationSignup />
        </div>
    }


    componentDidMount() {
        // console.log('did mount')
        // runCommand('live-video-notification.is-subscribed')
        // .then((isSubbed) => {
        //     console.log('subbed?', isSubbed)
        // })
        // .catch((err) => {
        //     console.error(err)
        // })
    }
}