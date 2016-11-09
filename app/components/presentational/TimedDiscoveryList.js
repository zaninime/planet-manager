import React, { Component } from 'react';
import DiscoveryList from 'app/components/connected/DiscoveryList';

class TimedDiscoveryList extends Component {
    constructor() {
        super();
        this.handleCallback = this.handleCallback.bind(this);

        this.state = { now: new Date() };
    }

    componentDidMount() {
        this.timer = setInterval(this.handleCallback, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    handleCallback() {
        this.setState({ now: new Date() });
    }

    render() {
        return (<DiscoveryList now={this.state.now} />);
    }
}

export default TimedDiscoveryList;
