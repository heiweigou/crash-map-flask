import React from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';




class Leftsection extends  React.Component{
    constructor(){
        super()
        this.state={
            showCrash:true
        }

    }

   
    render(){
        return (
            <div className="overlay">
                <h1>Melbourne</h1>
                <form>
                    <div className="form-group">
                        <input type="checkbox" value={this.state.showCrash} onChange={(e)=>this.props.changeHandler(e)}/>
                        <label className="form-check-label">
                            Show Crashes
                        </label>
                    </div>
                </form>
                <div className="row">
                    <div className="col">
                        <span>Low risk</span>
                    </div>
                    <div className="col legend" style={{backgroundColor:'#ffe0b3'}}>

                    </div>
                    <div className="col legend" style={{backgroundColor:'#ffb84d'}}>

                    </div>
                    <div className="col legend" style={{backgroundColor:'#ff9900'}}>

                    </div>
                    <div className="col legend" style={{backgroundColor:'#ff0000'}}>

                    </div>
                    <div className="col">
                        <span>high risk</span>
                    </div>

                </div>
                <div className="form-group">
                    <label>Risk greater than: <span ></span></label>
                    <Slider onChange={this.handlerChange} min={0} max={1} dots={true} step={0.2} />
                </div>
            </div>
        )
    }


}

export default Leftsection