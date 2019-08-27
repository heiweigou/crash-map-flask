import React from 'react';
import logo from './logo.svg';
import './App.css';
import MapContainer from './Map'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


class App extends React.Component {
    constructor(props){
        super(props)
        this.state={
            filterValue:0
        }
        this.handlerChange=this.handlerChange.bind(this)
    }

    handlerChange (value) {
        this.setState({filterValue:value})

    }

    render() {

        return (
            <div className="App">
                <br/>
                <Slider onChange={this.handlerChange} min={0} max={1} dots={true} step={0.2} />
                {this.state.filterValue}
                <MapContainer filterValue={this.state.filterValue}/>
            </div>
        );
    }

}

export default App;
