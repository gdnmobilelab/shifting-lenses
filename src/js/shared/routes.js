import { Router, Route, IndexRoute, Redirect, Link } from 'inferno-router';
import Component from 'inferno-component';
import config from '../config'
import NotFound from './components/not-found';
import ShiftingLenses from './components/shifting-lenses/shifting-lenses';
import Lens from './components/shifting-lenses/lens';
import LiveVideoLens from './components/lenses/live-video';
import LiveblogLens from './components/lenses/liveblog';
import {PageTitle, getLatestTitle} from './components/page-title';
import AppShell from './components/shell/app-shell';

class Wrapper extends Component {

    componentDidUpdate() {
        document.title = getLatestTitle();
    }

    render() {
        return this.props.children;
    }

}

function createLenses() {

    return <AppShell>
        <ShiftingLenses title="Inauguration">
            <Lens name="Social view" background="#66AA99" />
            <LiveblogLens name="Live blog" />
            <LiveVideoLens name="Live video" />
        </ShiftingLenses>
        </AppShell>
    
}

let routes = <Route component={Wrapper} path={config.basePath}>
    <IndexRoute component={ createLenses } />
    <Route path="*" component={ NotFound } />
</Route>;

export default routes;