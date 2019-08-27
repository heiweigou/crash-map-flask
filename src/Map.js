import React from 'react'
import {render} from 'react-dom'
import {Map, TileLayer, Marker, Popup, ZoomControl, CircleMarker, GeoJSON,Circle} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import Prediction from './Prediction'

class MapContainer extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            lat: -37.814,
            lng: 144.96332,
            zoom: 13,
            crashData: [],
            filterValue: 0,
            predictionData: {
                "type": "FeatureCollection",
                "features": []
            },
            filteredData: {
                "type": "FeatureCollection",
                "features": []
            }


        }
    }


    componentDidMount() {
        console.log('onece')
        fetch('/crash').then(response => response.json()).then(result => {
            this.setState({crashData: result.data})
        })

        fetch('/prediction').then(response => response.json()).then(result => {
            this.setState({predictionData: result.data})
            this.setState({filteredData: result.data})
            //console.log(result.data)
        })


    }

    componentWillReceiveProps(nextProps) {

        const filteredValue = this.state.predictionData.features.filter((item) => {
            if (item.properties.prediction >= nextProps.filterValue) {

                return item
            }
        })
        console.log(filteredValue.length)
        this.setState({

            filteredData: {
                "type": "FeatureCollection",
                "features": filteredValue
            }
        })
        // console.log(filteredValue.length)

    }


    getCrashPoint() {
        let points = []

        points = this.state.crashData.map((item, index) => {
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


        })

        console.log('points', points)

        return points
    }


    render() {
        const mapStyle = {
            width: '100%',
            height: '100%',
            top: '0',
            bottom: '0'
        }

        const position = [this.state.lat, this.state.lng];
        let points = this.getCrashPoint()
        console.log('render',points)
        // let prediction = this.new

        return (


            <Map center={position} zoom={this.state.zoom} style={mapStyle} zoomControl={false} preferCanvas={true}
                 maxZoom={18}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
                    id='mapbox.dark'
                    accessToken='pk.eyJ1IjoibmowMDA0NTAxMCIsImEiOiJjanhjczBsajEwNm5pM3NueHFldDhqOXNlIn0.I3Jol6t70c2p7b3GjrZHlQ'
                />

                <MarkerClusterGroup>
                    {points}
                </MarkerClusterGroup>

                <Prediction geoJson={this.state.filteredData}/>

                <ZoomControl position='bottomright'/>

            </Map>

        );
    }
}

export default MapContainer;