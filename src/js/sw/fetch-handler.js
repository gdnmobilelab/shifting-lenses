import Routes from '../shared/routes';
import { RouterContext, match } from 'inferno-router';
import renderToString from 'inferno-build/build/server/renderToString.js';
import url from 'url';
import PageWrapper from './page-wrapper';
import {getLatestTitle} from '../shared/components/page-title';
import NotFound from '../shared/components/not-found';

self.addEventListener('fetch', (e) => {
    let parsedURL = url.parse(e.request.url);
  
    let renderProps = match(Routes, parsedURL.pathname);
  
    if (renderProps && renderProps.redirect) {
        e.respondWith(new Response("", {
            headers: {
                'Location': renderProps.redirect
            },
            status: 302
        }))
        return;
    }

    if (!renderProps || renderProps.matched.props.children.props.component === NotFound) {
        
        // The above is completely insane, there must be a better way

        // We haven't matched with a route, so we pass it on to
        // external fetch.
        
        e.respondWith(fetch(e.request.url));
        return;
    }

    let result = <RouterContext {...renderProps}/>;

    let innerHTML = renderToString(result);
    let title = getLatestTitle();

    let fullPageHTML = PageWrapper({
       title 
    }, innerHTML);

    let response = new Response(fullPageHTML, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    })

    e.respondWith(response);
})