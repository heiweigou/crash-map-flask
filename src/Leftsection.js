import React from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Pagination from "react-js-pagination";




class Leftsection extends React.Component {
    constructor() {
        super()
        this.state = {

        }

    }

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.props.perPage);
    
        // this.setState({ offset: offset }, () => {
        //   this.loadCommentsFromServer();
        // });
      };

    render() {
        return (
            <div className="overlay">
                <h1>Melbourne</h1>
                <form>
                    <div className="form-group">
                        <input type="checkbox" checked={this.props.showCrash} onChange={(e) => this.props.crashHandler(e)} />
                        <label className="form-check-label">
                            Show Crashes
                        </label>
                    </div>
                </form>
                <div className="row">
                    <div className="col">
                        <span>Low risk</span>
                    </div>
                    <div className="col legend" style={{ backgroundColor: '#ffe0b3' }}>

                    </div>
                    <div className="col legend" style={{ backgroundColor: '#ffb84d' }}>

                    </div>
                    <div className="col legend" style={{ backgroundColor: '#ff9900' }}>

                    </div>
                    <div className="col legend" style={{ backgroundColor: '#ff0000' }}>

                    </div>
                    <div className="col">
                        <span>high risk</span>
                    </div>

                </div>
                <div className="form-group">
                    <label>Risk greater than: <span ></span></label>
                    <Slider onChange={(e) => this.props.changeHandler(e)} min={0} max={1} dots={true} step={0.2} />
                </div>

                <table className="table table-hover table-dark">
                    <tbody className="crashBody">
                        
                        {this.props.crashList.map((item) => {
                            let data = item.options.options
                            console.log(data)
                            //JSON.stringify(item)
                            return <tr key={data.id} onClick={() => {
                                data.flyTo(data.position)
                            }}>{data.dateOccured}</tr>
                        })}
                        

                    </tbody>
                </table>


                {/* <div id="paginationContainer"></div> */}

            </div>
        )
    }


}

export default Leftsection