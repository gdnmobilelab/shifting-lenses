import Component from 'inferno-component';

export default function ShiftingLensHeader(props) {
    let width = 45;
    let transformAmount = 50 - (45 / 2); // Base centering 

    transformAmount -= width * props.activeIndex; // then shift by index

    let styles = {
        transform: `translate3d(${transformAmount}vw,0,0)`
    };

    if (props.willChange) {
        // performance optimisation in chrome
        styles['will-change'] = 'transform';
    }

    if (props.animationDuration) {
        styles.transition = `transform ${props.animationDuration}s linear`;
    }

    return <div class='header-container'>
        <div class='header' style={styles}>
            {props.lenses.map((lens, i) => {

                let spanStyles = {
                    opacity: 0.8
                };

                if (props.willChange) {
                    spanStyles['will-change'] = 'opacity';
                }

           
                let distanceFromActiveIndex = Math.abs(props.activeIndex - i);
                
                if (distanceFromActiveIndex < 0.5) {
                    spanStyles.opacity += 0.2 * (1 - (distanceFromActiveIndex / 0.5));
                }

                return <span onClick={() => props.onSelected(i, true)} style={spanStyles}>{lens.props.name}</span>
            })}
        </div>
    </div>
}
