import React from 'react';
import logo from './logo.svg';
import './App.css';
import MapContainer from './Map'
import Leftsection from './Leftsection'
import Slider, { Range } from 'rc-slider';
import debounce from 'lodash.debounce';
class App extends React.Component {
    constructor(props){
        super(props)
        this.state={
            filterValue:0,
            showCrash:true,
            showCrashList:false
        }
        this.slideHandler=this.slideHandler.bind(this)
        this.crashHandler=this.crashHandler.bind(this)
        this.setFilterValueDebounced=debounce(this.setFilterValue,250)
    }

    crashHandler(e){
        console.log(e)
        this.setState((prevState)=>({showCrash:!prevState.showCrash}))
    }

    setFilterValue(filterValue){
        this.setState({filterValue:filterValue})
    }


    slideHandler(filterValue){
        this.setFilterValueDebounced(filterValue)
    }


    render() {

        return (
            <div className="App">
                <Leftsection changeHandler={this.slideHandler} crashHandler={this.crashHandler} showCrash={this.state.showCrash} showCrashList={this.state.showCrashList}/>
                <MapContainer filterValue={this.state.filterValue} showCrash={this.state.showCrash}/>
            </div>
        );
    }

}

export default App;
