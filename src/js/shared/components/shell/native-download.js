import Component from 'inferno-component';
import config from '../../../config';

export default class NativeAppDownload extends Component {

    constructor() {
        super()
        this.state = {
            show: false
        }

        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
    }

    render() {
        
        if (this.state.show !== true) {
            return null;
        }
        return <div id='app-download' onClick={this.hide}><div class='inner' onClick={(e) => e.stopPropagation()}>
            <div class='logo' />
            <h3>You need to download our app to use this feature.</h3>
            <p>We have a new iOS app that allows us to improve on the experience you get through the web.</p>
            <div class='spacer'/>
            <div class='buttons'>
                <button onClick={this.loadInNative}>I have the app</button>
                <button class='primary' onClick={this.redirectToAppStore}>Download the app</button>
            </div>
        </div></div>
    }

    loadInNative() {
        let fullURL = window.location.href;
        fullURL = "gdnmobilelab://" + fullURL.split("://")[1];
        window.location = fullURL;
    }

    redirectToAppStore() {
        alert("This will go to the app store when the app is live.")
    }

    hide() {
        this.setState({
            show: false
        })
    }

    show() {
        this.setState({
            show: true
        });
    }
}