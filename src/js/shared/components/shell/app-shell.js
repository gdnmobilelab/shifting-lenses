import NativeDownload from './native-download';

export let appDownloadComponent;

export default function(props) {
    return <div id='shell'>
        <NativeDownload ref={(d) => appDownloadComponent = d} />
        {props.children}
    </div>
}