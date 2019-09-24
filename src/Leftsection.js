import React from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactPaginate from 'react-paginate';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enGB from 'date-fns/locale/en-GB';
import { Pagination } from 'semantic-ui-react'
registerLocale('es', enGB)



class Leftsection extends React.Component {
    constructor() {
        super()
        this.state = {
            startDate: new Date(2010, 1, 1),
            endDate: new Date(2017, 1, 1),
            selectsStart: 'selectsStart',
            selectsEnd: true,
            paginationList: [],
            crashList: []

        }

        this.paginationHandler = this.paginationHandler.bind(this)
    }

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.props.perPage);

        // this.setState({ offset: offset }, () => {
        //   this.loadCommentsFromServer();
        // });
    };

    setStartDate(date) {

    }

    paginationHandler(e, data) {
        let index = data.activePage - 1
        let crashlist = this.state.paginationList[index]
        this.setState({
            crashList: crashlist
        })
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     if(nextProps.crashList.length===0){
    //         return false
    //     }
    //     return true
    // }
    componentWillReceiveProps(nextProps) {
        // if(nextProps.crashList.length==0){
        //     return
        // }

        let pages = Math.ceil(nextProps.crashList.length / 10)
        let paginationList = []
        for (let i = 0; i < pages; i++) {
            paginationList.push([])
        }
        //   console.log(paginationList.length)
        for (let i = 0; i < nextProps.crashList.length; i++) {

            for (let j = 0; j < paginationList.length; j++) {
                if (i < (j + 1) * 10 && i >= (j) * 10) {


                    paginationList[j].push(nextProps.crashList[i])
                }
            }
        }

        if (paginationList.length > 0) {

            this.setState({
                paginationList: paginationList,
                crashList: paginationList[0]
            })
            console.log(this.state)
        }
    }


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
                    {
                        this.props.showCrash && <div className='form-group'>
                            <DatePicker
                                selected={this.props.dateRange.startDate}
                                onChange={(date, event) => this.props.startDateHandler(date)}
                                selectsStart
                                onSelected={(e) => console.log(e)}
                                startDate={this.props.dateRange.startDate}
                                endDate={this.props.dateRange.endDate}
                                locale='es'
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown

                            />
                            <DatePicker
                                selected={this.props.dateRange.endDate}
                                onChange={date => this.props.endDateHandler(date)}
                                selectsEnd
                                endDate={this.props.dateRange.endDate}
                                minDate={this.props.dateRange.startDate}
                                locale='es'
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                            />
                        </div>}
                </form>
                <div className="row">
                    <div className="col">
                        <span>Low risk</span>
                    </div>
                  
                    <div className="col legend" style={{ backgroundColor: 'green' }}>

                    </div>
                    <div className="col legend" style={{ backgroundColor: 'yellow' }}>

                    </div>
                    <div className="col legend" style={{ backgroundColor: 'orange' }}>

                    </div>
                    <div className="col legend" style={{ backgroundColor: 'red' }}>

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

                        {this.state.crashList.length > 0 && this.state.crashList.map((item) => {
                            let data = item.options.options
                            //console.log(data)
                            //JSON.stringify(item)
                            return <tr key={data.id} onClick={() => {
                                data.flyTo(data.position)
                            }}>{data.dateOccured}</tr>
                        })}
                        {this.state.crashList.length > 0 && <Pagination
                            defaultActivePage={1}
                            boundaryRange={0}
                            siblingRange={0}
                            totalPages={this.state.paginationList.length}
                            onPageChange={this.paginationHandler}

                        />}


                    </tbody>
                </table>


                <div id="paginationContainer">

                </div>

            </div>
        )
    }


}

export default Leftsection