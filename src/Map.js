import React from 'react'
import { render } from 'react-dom'
import { Map, TileLayer, Marker, Popup, ZoomControl, CircleMarker, GeoJSON, Circle, Polyline, Polygon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import debounce from 'lodash.debounce';
import Leftsection from './Leftsection'
import RightSection from './RightSection'
import L from 'leaflet';

import compareAsc from 'date-fns/compareAsc'


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
                // "type": "FeatureCollection",
                // "features": []
            },
            showCrash: true,
            crashList: [],
            predictionRank: [],
            selectedLine: [],
            //street name and risk score
            primary: '',
            secondary: '',
            score: null,
            value: '',
            suggestions: [],
            locality: {
                center: [],
                geometry: {
                    coordinates: []
                }
            },
            dateRange: {
                startDate: new Date(2015, 1, 1),
                endDate: new Date()
            },


        }
        this.slideHandler = this.slideHandler.bind(this)
        this.crashHandler = this.crashHandler.bind(this)
        this.selectLineHandler = this.selectLineHandler.bind(this)
        this.flyTo = this.flyTo.bind(this)
        this.setFilterValueDebounced = debounce(this.setFilterValue, 250)
        this.localityHandler = this.localityHandler.bind(this)
        this.startDateHandler = this.startDateHandler.bind(this)
        this.endDateHandler = this.endDateHandler.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
    }


    componentDidMount() {

        fetch('/crash').then(response => response.json()).then(result => {
            this.setState({ crashData: result.data })
        })

        fetch('/prediction').then(response => response.json()).then(result => {
            this.setState({ predictionData: result.data, predictionRank: result.prediction })

            //console.log(result.data)
        })

        this.map = this.mapInstance.leafletElement



    }

    crashHandler(e) {

        this.setState((prevState) => ({ showCrash: !prevState.showCrash }))
    }

    setFilterValue(filterValue) {
        this.setState({ filterValue: filterValue })
    }
    localityHandler(locality, center) {
        this.reverseCoordinates(locality.geometry)
        this.setState({
            locality: { geometry: locality.geometry, center: center }
        })
        this.flyTo(this.state.locality.center)

        //this.flyTo(this.state.locality.center)


    }

    startDateHandler(startDate) {
        let props = { ...this.state.dateRange }
        props.startDate = startDate

        this.setState({
            dateRange: props
        })
    }
    endDateHandler(endDate) {
        let props = { ...this.state.dateRange }
        props.endDate = endDate

        this.setState({
            dateRange: props
        })
    }


    slideHandler(filterValue) {
        this.setFilterValueDebounced(filterValue)

    }

    clickHandler(e) {
        const prediction = e.target.feature.properties.prediction
        const name = e.target.feature.properties.segment.display_name

        let position = e.target.feature.geometry


        this.reverseCoordinates(position)
        this.streetNameFormatter(name)

        this.setState({
            selectedLine: position.coordinates,
            score:prediction
        })



    }

    streetNameFormatter(name) {
        let key = ['between', 'near', 'from']
        let primary = ''
        let secondary = ''
       
        primary = name
        for (let item of key) {

            if (name.includes(item)) {
                let position = name.indexOf(item)
                primary = name.slice(0, position)
                secondary = name.slice(position)
            }

       
        this.setState({
            primary: primary,
            secondary:secondary
        })

    }}
    flyTo(position) {
        this.map.flyTo(position, 15)
    }

    reverseCoordinates(geometry) {
        if (geometry.type === 'MultiLineString' || geometry.type === 'Polygon') {
            for (let i in geometry.coordinates) {
                for (let j in geometry.coordinates[i]) {
                    geometry.coordinates[i][j].reverse()
                }
            }
        }
        else if (geometry.type === "LineString") {
            for (let i in geometry.coordinates) {
                geometry.coordinates[i].reverse()
            }
        }
    }

    selectLineHandler(positions, name, score) {
        this.streetNameFormatter(name)
        this.setState({
            selectedLine: positions,
            score:score
        })
    }
    getCrashPoint() {
        let points = []

        for (let index = 0; index < this.state.crashData.length; index++) {
            let item = this.state.crashData[index]
            let latlng = [item.location.latitude, item.location.longitude]
            let id = item.id
            let dateOccured = item.dateOccurred
            let dateObj = new Date(dateOccured)
            if (index > 1000) {
                return points
            }
            // console.log(this.state.crashData.length)
            if (compareAsc(this.state.dateRange.startDate, dateObj) === -1 && compareAsc(this.state.dateRange.endDate, dateObj) === 1) {
                let marker = <Marker position={latlng} key={id} options={{ id: id, position: latlng, dateOccured: dateOccured, flyTo: this.flyTo }}>
                    <Popup minWidth={200} closeButton={false}>
                        <div>
                            <b>Date: {dateOccured}</b>

                        </div>
                    </Popup>
                </Marker>
                points.push(marker)
            }


        }
        return points
        // points = this.state.crashData.map((item, index) => {
        //     let latlng = [item.location.latitude, item.location.longitude]
        //     let id = item.id
        //     let dateOccured = item.dateOccurred

        //     if (index > 100) {
        //         return
        //     }

        //     return (

        //         <Marker position={latlng} key={id} options={{ id: id, position: latlng, dateOccured: dateOccured, flyTo: this.flyTo }}>
        //             <Popup minWidth={200} closeButton={false}>
        //                 <div>
        //                     <b>Date: {dateOccured}</b>

        //                 </div>
        //             </Popup>
        //         </Marker>
        //     )


        // })

        //console.log('points', points)

    }
    getColor(prediction) {
        let color = ''
        // if (prediction > 0 && prediction <= 0.25)
        //     color = '#ffe0b3'
        // else if (prediction > 0.25 && prediction <= 0.5)
        //     color = '#ffb84d'
        // else if (prediction > 0.5 && prediction <= 0.8)
        //     color = '#ff9900'
        // else if (prediction > 0.8 && prediction <= 1)
        //     color = '#ff0000'

            if (prediction > 0 && prediction <= 0.25)
            color = 'green'
        else if (prediction > 0.25 && prediction <= 0.5)
            color = 'yellow'
        else if (prediction > 0.5 && prediction <= 0.8)
            color = 'orange'
        else if (prediction > 0.8 && prediction <= 1)
            color = 'red'

        return color
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

                <Leftsection
                    changeHandler={this.slideHandler}
                    crashHandler={this.crashHandler}
                    showCrash={this.state.showCrash}
                    crashList={this.state.crashList}
                    startDateHandler={this.startDateHandler}
                    endDateHandler={this.endDateHandler}
                    dateRange={this.state.dateRange}
                    perPage={10} />
                <RightSection predictionRank={this.state.predictionRank} flyHandler={this.flyTo} selectLineHandler={this.selectLineHandler} 
                primary={this.state.primary} 
                secondary={this.state.secondary}
                score={this.state.score}
                localityHandler={this.localityHandler} 
                progressColor={this.getColor} />
                <Map center={position} zoom={this.state.zoom} style={mapStyle} zoomControl={false} preferCanvas={true} ref={e => { this.mapInstance = e }}
                    maxZoom={18}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
                        id='mapbox.streets'
                        accessToken='pk.eyJ1IjoibmowMDA0NTAxMCIsImEiOiJjanhjczBsajEwNm5pM3NueHFldDhqOXNlIn0.I3Jol6t70c2p7b3GjrZHlQ'
                    />
                    {
                        this.state.showCrash && <MarkerClusterGroup
                            onClusterClick={(layer) => {
                                //console.log(layer)
                                this.setState({ crashList: layer.layer.getAllChildMarkers() })
                            }}>
                            {points}
                        </MarkerClusterGroup>
                    }
                    {this.state.selectedLine.length !== 0 &&
                        <Polyline positions={this.state.selectedLine} color={'green'} weight={10} />}
                    {Object.keys(this.state.locality).length !== 0 && <Polygon positions={this.state.locality.geometry.coordinates} />}

                    {Object.keys(this.state.predictionData).length !== 0 && <GeoJSON
                        key={this.state.filterValue}
                        data={this.state.predictionData}
                        style={(feature) => {
                            let prediction = feature.properties.prediction
                            let color = this.getColor(prediction)

                            return { color: color }
                        }
                        }
                        onEachFeature={(feature, layer) => {

                            layer.on({ 'click': this.clickHandler })
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