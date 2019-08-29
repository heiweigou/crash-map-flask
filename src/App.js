import React from 'react';
import logo from './logo.svg';
import './App.css';
import MapContainer from './Map'
import Leftsection from './Leftsection'


class App extends React.Component {
    constructor(props){
        super(props)
        this.state={
            filterValue:0,
            showCrash:true
        }

    }

    changeHandler(e){
        console.log(e)
        this.setState((prevState)=>({showCrash:!prevState.showCrash}))
    }


    render() {

        return (
            <div className="App">
                <Leftsection changeHandler={this.changeHandler}/>
                <MapContainer filterValue={this.state.filterValue}/>
            </div>
        );
    }

}

export default App;
