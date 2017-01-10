import Component from 'inferno-component';
import Proportional from '../proportional';
import VideoControlOverlay from '../../live-video/control-overlay';

export default class LivestreamVideo extends Component {
    render() {
     
        let video = <video
            ref={(v) => this.videoElement = v}
            playsinline
            muted
            autoplay
            onPlaying={this.videoIsPlaying.bind(this)}
        />;

        if (this.props.play) {
            video.props.src = this.props.src;
        }

        let loadingOverlay = null;
        let canvas = null;
       
        if (!this.state || !this.state.videoIsPlaying) {
            loadingOverlay = <div class='video-load-overlay'/>;
        } else if (this.state.videoIsPlaying) {
            let width = window.innerWidth * window.devicePixelRatio;
            let height = Math.round(width * this.props.proportion);
            canvas = <canvas width={width} height={height} ref={(c) => this.canvasElement = c} />
        }

        return <Proportional proportion={this.props.proportion}>
            <div class='video-container'>
            {video}
            {loadingOverlay}
            {canvas}
        </div>
        </Proportional>
    }

    componentDidUpdate(prevProps) {
        if (prevProps.play !== this.props.play) {
            // as described here: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
            // using .pause() isn't good enough because it will continue to stream the video. Instead we need to
            // unset the src attribute (which we do in render()) and then call .load()
            this.videoElement.load();
        }

        if (this.state.videoIsPlaying) {
            new VideoControlOverlay(this.canvasElement, this.videoElement, window.devicePixelRatio);
        }
    }

    componentDidMount() {
       
        
    }

    videoIsPlaying() {
        this.setState({
            videoIsPlaying: true
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.play !== true && this.state.videoIsPlaying === true) {
            nextState.videoIsPlaying = false
        } 
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  nextProps.play !== this.props.play ||
                nextProps.src !== this.props.src ||
                nextState.videoIsPlaying !== this.state.videoIsPlaying
    }
}