import React from 'react'
import {render} from 'react-dom'
import {GeoJSON} from 'react-leaflet'
import {Map, TileLayer, Marker, Popup, ZoomControl, CircleMarker} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import 'leaflet/dist/leaflet.css'

class Crash extends React.Component {
    constructor(props) {
        super(props)
        this.state = {...props}
    }





    render() {
        setTimeout((()=>{
            this.setState({
                crashData:[]
            })
        }),50000)

        return (
            <MarkerClusterGroup>
                {this.state.crashData.map(item=>{
                    let latlng = [item.location.latitude, item.location.longitude]
                    let id = item.id
                    let dateOccured = item.dateOccurred

                    return (

                        <CircleMarker center={latlng} key={id}>
                            {/*<Popup minWidth={200} closeButton={false}>*/}
                            {/*<div>*/}
                            {/*<b>Date: {dateOccured}</b>*/}

                            {/*</div>*/}
                            {/*</Popup>*/}
                        </CircleMarker>
                    )
                })}
            </MarkerClusterGroup>
        )
    }
}

export default Crash