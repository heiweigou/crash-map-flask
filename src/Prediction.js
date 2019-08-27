import React from 'react'
import {render} from 'react-dom'
import {GeoJSON} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-markercluster'

class Prediction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            predictionData: {
                "type": "FeatureCollection",
                "features": []
            }


        }
    }

    componentDidMount() {


    }

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            this.setState({
                predictionData: nextProps.geoJson
            })
        }, 0.01)

        // this.setState({
        //     predictionData: nextProps.geoJson
        // })
        this.setState({
            predictionData: {
                "type": "FeatureCollection",
                "features": []
            }
            }
        )

    }

    render() {

        let length = this.state.predictionData.features.length != 0
        console.log(this.state.predictionData.features.length)
        return (
            <div>
                {length && <GeoJSON
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
                        return { color: color }}
                    }
                    onEachFeature={(feature, layer) => {
                    const clickHandler = (e) => {
                        const prediction = e.target.feature.properties.prediction
                        const name = e.target.feature.properties.segment.display_name

                    }
                    layer.on('click', clickHandler)
                }}

                >
                </GeoJSON>}

            </div>

        )
    }
}

export default Prediction