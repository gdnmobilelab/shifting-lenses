import Component from 'inferno-component';
import LensHeader from './lens-header';
import {PageTitle} from '../page-title';

const TOUCH_INTERACTION_STATE = {
    UNKNOWN: 0,
    SCROLL: 1,
    SWIPE: 2
}

const SWIPE_DIRECTION = {
    LEFT: 0,
    RIGHT: 1
}

export default class ShiftingLenses extends Component {

    constructor() {
        super();
        this.state = {
            activeIndex: 1
        }

        this.onLensScroll = this.onLensScroll.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.setIndex = this.setIndex.bind(this);
    }

    render() {
        
        let lensTransform = String(this.state.activeIndex * -100) + "vw";
        let headerIndex = this.state.activeIndex;

        if (this.state.currentSwipePosition) {
            // Being a little tricky here, using vw above so that the server
            // doesn't crash when we try to use window.innerWidth, but we want
            // to use px here.
            let initialTransform = (-window.innerWidth * this.state.activeIndex);
            let diff = this.state.currentSwipePosition.x - this.state.initialSwipePosition.x;
            initialTransform += diff;
            lensTransform = String(initialTransform) + 'px';

            headerIndex -= diff / window.innerWidth;
        }

        let lensContainerStyles = {
            transform: `translate3d(${lensTransform},0,0)`
        };

        let lensContainerClass = 'lenses';
        let touchMoveEvent = null;
        let willChange = false;

        if (this.state.animationDuration) {
            lensContainerStyles.transition = `transform ${this.state.animationDuration}s linear`;
        }

        if (this.state.interactionState === TOUCH_INTERACTION_STATE.SWIPE) {
            lensContainerClass += ' no-touching';
            willChange = true;
            lensContainerStyles['will-change'] = 'transform';
        }

        if (this.state.interactionState !== TOUCH_INTERACTION_STATE.SCROLL) {
            // if we're scrolling then we don't need to listen to touchmove - maybe
            // a performance benefit to not doing it?
            touchMoveEvent = this.onTouchMove;
        }

        let titleElement = this.props.title ? <PageTitle title={this.props.title} /> : null

        if (this.props.children[this.state.activeIndex]) {
            console.log('setting active')
            this.props.children[this.state.activeIndex].props.active = true;
        }

        return <div
            class='shifting-lenses'
            onTouchStart={this.onTouchStart}
            onTouchMove={touchMoveEvent}
            onTouchEnd={this.onTouchEnd}
            >
            {titleElement}
            <LensHeader
                lenses={this.props.children}
                activeIndex={headerIndex}
                onSelected={this.setIndex}
                animationDuration={this.state.animationDuration}
                willChange={willChange}
            />
           
            <div class={lensContainerClass} style={lensContainerStyles}

                // need this for setting scroll events and CSS transforms
                ref={(c) => this.lensContainerEl = c}

                
            >
                {this.props.children}
            </div>
        </div>
    }

    setIndex(newIndex) {
        this.setState({
            animationDuration: 0.1,
            activeIndex: newIndex
        })
    }

    addScrollListenersToLenses() {

        // Scroll events don't propagate, so we have to manually add them.
        this.cachedLensNodes = this.lensContainerEl.childNodes;
        this.cachedLensNodes.forEach((n) => {
            n.addEventListener('scroll', this.onLensScroll);
        })
    }

    removeScrollListenersFromLenses() {
        this.cachedLensNodes.forEach((n) => {
            n.removeEventListener('scroll', this.onLensScroll);
        })
    }
    
    onLensScroll(e) {
        // If the lens starts scrolling, we don't want to swipe and scroll at the same time.
        this.setState({
            interactionState: TOUCH_INTERACTION_STATE.SCROLL,
            initialSwipePosition: null,
            currentSwipePosition: null
        })
       
        // We can immediately remove these listeners in a bid to improve performance.
        this.removeScrollListenersFromLenses();
        e.stopPropagation();
    }

    onTouchStart(e) {

        this.addScrollListenersToLenses();
        // document.removeEventListener('touchmove', this.preventDefault);

        this.setState({
            interactionState: TOUCH_INTERACTION_STATE.UNKNOWN,
            initialSwipePosition: {
                x: e.touches[0].screenX,
                y: e.touches[0].screenY
            },
            last5Touches: null,
            animationDuration: 0
        })
    }

    onTouchEnd(e) {

        // this.lensContainerEl.classList.remove('no-touching');
        

        if (this.state.interactionState !== TOUCH_INTERACTION_STATE.SWIPE) {
            return;
        }

       
        this.removeScrollListenersFromLenses();

        let percentOver = (e.changedTouches[0].screenX - this.state.initialSwipePosition.x) / window.innerWidth;
       
        let newIndex = this.state.activeIndex;

        let animationDuration = 0.1;

        let indexChange = 0;

        if (percentOver > 0.5) {
            indexChange = -1;
        } else if (percentOver < -0.5) {
            indexChange = 1;
        }

        if (this.state.last5Touches) {
            let firstTouch = this.state.last5Touches[0];
            let lastTouch = {
                x: e.changedTouches[0].screenX,
                y: e.changedTouches[0].screenY,
                time: e.timeStamp
            };

            let timeDiff = lastTouch.time - firstTouch.time;
            let xDiff = lastTouch.x - firstTouch.x;
            let yDiff = lastTouch.y - firstTouch.y;

            if (timeDiff < 100 && Math.abs(xDiff) > 0 && Math.abs(yDiff) < 30) {
                indexChange = xDiff > 0 ? -1 : 1;
            }

            console.log('ts', timeDiff, xDiff, yDiff, this.state.last5Touches.length + 1)
        }

        if (indexChange == -1 && newIndex > 0 ||
            indexChange == 1 && newIndex < this.props.children.length - 1) {
                newIndex += indexChange;
            }


        this.setState({
            initialSwipePosition: null,
            currentSwipePosition: null,
            last5Touches: null,
            activeIndex: newIndex,
            animationDuration: animationDuration,
            interactionState: TOUCH_INTERACTION_STATE.UNKNOWN
        })
    }

    checkForInteractionState(e) {
        let newX = e.touches[0].screenX;
        let diff = Math.abs(this.state.initialSwipePosition.x - newX);

        if (diff > 10) {
            // this.lensContainerEl.classList.add('no-touching');
            // document.addEventListener('touchmove', this.preventDefault);
            this.setState({
                interactionState: TOUCH_INTERACTION_STATE.SWIPE
            });
        }
    }

    onTouchMove(e) {
        e.stopPropagation();
        if (this.state.interactionState === TOUCH_INTERACTION_STATE.SCROLL) {
            return
        }

        if (this.state.interactionState === TOUCH_INTERACTION_STATE.UNKNOWN) {
            this.checkForInteractionState(e);
        }

        if (this.state.interactionState === TOUCH_INTERACTION_STATE.SWIPE) {

            let newX = e.touches[0].screenX;

            // We record the last 5 touches, in order to calculate speed
            // and direction on touchend

            let last5Touches = this.state.last5Touches || [];

            last5Touches.push({
                x: e.touches[0].screenX,
                y: e.touches[0].screenY,
                time: e.timeStamp
            });

            while (last5Touches.length > 5) {
                last5Touches.shift();
            }


            let diff = this.state.initialSwipePosition.x - newX;
           
            if (this.state.activeIndex === 0 && diff < 0 ||
                this.state.activeIndex === this.props.children.length - 1 && diff > 0
            ) {

                // add a "rubber banding" effect if the user is trying to swipe
                // in the wrong direction

                newX = this.state.initialSwipePosition.x - (diff * 0.05);
            }

            let newState = {
                currentSwipePosition: {
                    x: newX,
                    y: e.touches[0].screenY
                },
                last5Touches: last5Touches
            }

            this.setState(newState);

            e.stopPropagation();
            e.preventDefault();
        }

        
    }

    preventDefault(e) {
        console.log('prev!')
        e.preventDefault()
    }

    componentDidMount() {
        document.addEventListener('touchmove', (e) => e.preventDefault())
    }
}