import config from '../config';

const defaultProps = {
    title: "Mobile Lab",
    prefix: config.basePath,
    themeColor: "#0D6292"
};


export default function createWrapper(specifiedProps, contents) {

    let props = Object.assign({}, defaultProps, specifiedProps);

    let backURLTag = "";

    if (props.defaultBackURL) {
        backURLTag = `<meta name="default-back-url" content="${props.defaultBackURL}" />`;
    }

    return `<!DOCTYPE html>
    <html>
    <head>
        <title>${props.title}</title>
        <link rel="manifest" href="${props.prefix}/manifest.json" />
        <link rel="stylesheet" href="${props.prefix}/styles.css" type="text/css" />
        <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no" />
        <meta name="theme-color" content="${props.themeColor}" />
        <meta charset="utf-8" /> 
        ${backURLTag}
        <script>
            if (typeof navigator !== "undefined" && navigator.userAgent.indexOf("hybridwebview") > -1) {
                document.documentElement.className = "ios-hybrid"
            }
        </script>
    </head>
    <body>
    <div id="main">${contents}</div>
    </body>
    <script src="${props.prefix}/client.js" async></script>
    <script async>
        if (navigator.serviceWorker) {
            navigator.serviceWorker.register('${props.prefix}/sw.js', {scope: '${props.prefix}/'});
        }
    </script>
    <script>document.write('<script src="//alastairtest-lr.ngrok.io/livereload.js?snipver=1"></' + 'script>')</script>

    </html>`
}
