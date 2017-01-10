import opentype from 'opentype.js';
import config from '../../config';

const ICON_CHARACTERS = {
    VOLUME_OFF: '\uEA01',
    VOLUME_ON: ''
}
console.log('wtf', ICON_CHARACTERS.VOLUME_ON === ICON_CHARACTERS.VOLUME_OFF)
function loadFont(url) {
    return new Promise((fulfill, reject) => {
        opentype.load(url, (err, font) => {
            if (err) {
                reject(err);
            } else {
                fulfill(font);
            }
        })
    })
}

export default class VideoOverlay {
    constructor(canvas, video, devicePixelRatio) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.devicePixelRatio = devicePixelRatio;
        this.loadAssets()
        .then(() => {
            this.drawControls();
        })
        .catch((err) => {
            console.error(err);
        })
    }

    loadAssets() {
        return loadFont(config.basePath + '/icons.ttf')
        .then((font) => {
            this.iconFont = font;
        })
    }

    drawControls() {
        this.ctx.fillStyle = '#fff';
        console.log('glyphs',this.iconFont.stringToGlyphs(ICON_CHARACTERS.VOLUME_OFF))
        let test = this.iconFont.getPath(ICON_CHARACTERS.VOLUME_OFF, 0, 72, 72);
        console.log('bbox', test.getBoundingBox());
        test.draw(this.ctx);
        this.ctx.fill();
        // test.draw(this.ctx);
        this.ctx.fillRect(200,200,50,50);
        // this.ctx.fill()
        console.log("drew it")
    }
}