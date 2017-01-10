import Lens from '../shifting-lenses/lens';
import Component from 'inferno-component';



export default class LiveVideoLens extends Component {
    
    render() {
        return <div class='lens live-video-lens'>
           <h5><span class='live-blob'/> Live video</h5>
            <video
             ref={(v) => this.videoElement = v}
             src='https://devimages.apple.com.edgekey.net/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8'
             playsinline
             muted
             preload="metadata"
              />
        </div>
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.active) {
            this.videoElement.pause();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        
        return true;
    }

    componentDidMount() {
        document.body.addEventListener('touchend', () => {
            //this.videoElement.play()
        })
        
    }
}