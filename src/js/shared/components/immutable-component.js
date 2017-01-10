import Component from 'inferno-component';

export default class ImmutableComponent extends Component {
    
    setInitialState(state) {
        this.state = {
            data: state
        };
    }

    setImmutableState(state) {
        this.setState({
            data: state
        })
    }

    get immutableState() {
        return this.state.data;
    }

    set immutableState(state) {
        this.state = {
            data: state
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.data !== this.state.data;
    }

}