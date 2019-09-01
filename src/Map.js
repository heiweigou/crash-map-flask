import React from 'react'
import { render } from 'react-dom'
import { Map, TileLayer, Marker, Popup, ZoomControl, CircleMarker, GeoJSON, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import debounce from 'lodash.debounce';
import Leftsection from './Leftsection'
import RightSection from './RightSection'
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class App extends React.Component {


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
            showCrash: true,
            crashList: []



        }
        this.slideHandler = this.slideHandler.bind(this)
        this.crashHandler = this.crashHandler.bind(this)
        this.flyTo=this.flyTo.bind(this)
        this.setFilterValueDebounced = debounce(this.setFilterValue, 250)
    }


    componentDidMount() {
      
        fetch('/crash').then(response => response.json()).then(result => {
            this.setState({ crashData: result.data })
        })

        fetch('/prediction').then(response => response.json()).then(result => {
            this.setState({ predictionData: result.data })

            //console.log(result.data)
        })
       
            this.map = this.mapInstance.leafletElement
          


    }

    crashHandler(e) {
        console.log(e)
        this.setState((prevState) => ({ showCrash: !prevState.showCrash }))
    }

    setFilterValue(filterValue) {
        this.setState({ filterValue: filterValue })
    }


    slideHandler(filterValue) {
        this.setFilterValueDebounced(filterValue)
    }

    flyTo(position){
        this.map.flyTo(position,15)
    }

    getCrashPoint() {
        let points = []

        points = this.state.crashData.map((item, index) => {
            let latlng = [item.location.latitude, item.location.longitude]
            let id = item.id
            let dateOccured = item.dateOccurred

            if (index > 100) {
                return
            }

            return (

                <Marker position={latlng} key={id} options={{id:id,position:latlng,dateOccured:dateOccured,flyTo:this.flyTo }}>
                    <Popup minWidth={200} closeButton={false}>
                        <div>
                            <b>Date: {dateOccured}</b>

                        </div>
                    </Popup>
                </Marker>
            )


        })

        //console.log('points', points)

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


        return (

            <div className='App'>
                <Leftsection changeHandler={this.slideHandler} crashHandler={this.crashHandler} showCrash={this.state.showCrash} crashList={this.state.crashList} perPage={10}/>
                <RightSection/>
                <Map center={position} zoom={this.state.zoom} style={mapStyle} zoomControl={false} preferCanvas={true} ref={e => { this.mapInstance = e }}
                    maxZoom={18}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
                        id='mapbox.dark'
                        accessToken='pk.eyJ1IjoibmowMDA0NTAxMCIsImEiOiJjanhjczBsajEwNm5pM3NueHFldDhqOXNlIn0.I3Jol6t70c2p7b3GjrZHlQ'
                    />
                    {
                        this.state.showCrash&&<MarkerClusterGroup
                            onClusterClick={(layer) => {
                                console.log(layer)
                                 this.setState({ crashList: layer.layer.getAllChildMarkers() })
                            }}>
                            {points}
                        </MarkerClusterGroup>
                    }

                    {<GeoJSON
                        key={this.state.filterValue}
                        data={this.state.predictionData}
                        style={(feature) => {
                            let prediction = feature.properties.prediction
                            let color = ''
                            if (prediction > 0 && prediction <= 0.25)
                                color = '#ffe0b3'
                            else if (prediction > 0.25 && prediction <= 0.5)
                                color = '#ffb84d'
                            else if (prediction > 0.5 && prediction <= 0.8)
                                color = '#ff9900'
                            else if (prediction > 0.8 && prediction <= 1)
                                color = ' #ff0000'
                            return { color: color }
                        }
                        }
                        onEachFeature={(feature, layer) => {
                            const clickHandler = (e) => {
                                const prediction = e.target.feature.properties.prediction
                                const name = e.target.feature.properties.segment.display_name
                                console.log(prediction, name)
                            }
                            layer.on('click', clickHandler)
                        }}
                        filter={(geojsonFeature) => {

                            if (geojsonFeature.properties.prediction >= this.state.filterValue) {
                                return true
                            }
                        }}
                    >
                    </GeoJSON>}
                  

                    <ZoomControl position='bottomright' />

                </Map>
            </div>


        );
    }
}

export default App;