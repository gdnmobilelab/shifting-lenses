import Lens from '../shifting-lenses/lens';
import Component from 'inferno-component';
import Proportional from '../proportional';
import config from '../../../config';
import browser from '../../util/browser';
import LivestreamVideo from '../blocks/livestream-video';

export default class LiveVideoLens extends Component {
    
    render() {
        return <div class='lens live-video-lens'>
           <h5 class='video-header'><span class='live-blob'/> Live video</h5>
            
                <LivestreamVideo proportion={9/16} src='https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4' play={this.props.active} />
            
            <p>Description of the live stream video.</p>
        </div>
    }
}