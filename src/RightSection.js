import React from 'react'
import Autosuggest from 'react-autosuggest';
import { Progress } from 'semantic-ui-react'

// import 'semantic-ui-css/semantic.min.css'
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



function getSuggestionValue(suggestion) {
    return suggestion.place_name;
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.place_name}</span>
    );
}
class RightSection extends React.Component {
    constructor() {
        super()
        this.state = {
            prediction: [],
            streetName: {
                primary: '',
                secondary: ''
            },
            value: '',
            suggestions: [],

        }
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this)

    }





    onChange = (event, { newValue, method }) => {

        let url = new URL("https://api.mapbox.com/geocoding/v5/mapbox.places/" + newValue + ".json?")
        let data = {
            access_token: 'pk.eyJ1IjoibmowMDA0NTAxMCIsImEiOiJjanhjczBsajEwNm5pM3NueHFldDhqOXNlIn0.I3Jol6t70c2p7b3GjrZHlQ',
            country: 'AU'
        }
        url.search = new URLSearchParams(data)


        this.setState({
            value: newValue
        });
        if (newValue.length > 2) {
            fetch(url.toString()).then(res => res.json())
                .then(response => {
                    console.log(response)
                    this.setState({
                        suggestions: response.features
                    });
                })
        }





    };

    shouldRenderSuggestions(value) {

        return value.trim().length > 2;
    }



    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {

        fetch('/locality/' + suggestion.text).then(res => res.json()).then(res => {

            console.log(suggestion)

            this.props.localityHandler(res.data, [suggestion.center[1], suggestion.center[0]])
        })
    }
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });

    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };
    getSuggestions(value) {
        const escapedValue = escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }

        const regex = new RegExp('^' + escapedValue, 'i');

        return this.state.suggestions;
    }

    reverseCoordinates(geometry) {
        if (geometry.type === 'MultiLineString') {
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
    render() {
        let predictionRank = this.props.predictionRank


        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Type address",
            value,
            onChange: this.onChange
        };
        return (<div>
            <div className="overlay ui-front roadInfo">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}

                />
                <h2 className="roadName">{this.props.primary}</h2>
                <p>{this.props.secondary}</p>

                {this.props.score != null && 
                <Progress value={this.props.score.toFixed(2)} progress='value' total={1} 
                
                color={this.props.progressColor(this.props.score)} />}
                
              
                <ol className="riskRank">
                    {predictionRank.map((item) => <li key={item.properties.segment_id} onClick={(e) => {
                        let geometry = item.geometry
                        let score = item.properties.prediction
                        let streetName = item.properties.segment.display_name
                        this.reverseCoordinates(geometry)
                        this.props.selectLineHandler(geometry.coordinates, streetName, score)


                        this.props.flyHandler([item.properties.segment.center_y, item.properties.segment.center_x])
                    }}>{item.properties.segment.display_name}</li>)}
                </ol>
                <p>Report bug to: wangzhen.jiao@roads.vic.gov.au</p>

 
            </div>
        </div>)

    }
}
export default RightSection