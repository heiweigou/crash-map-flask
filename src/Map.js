import React from 'react';
import {Button} from 'react-bootstrap'
import 'leaflet'
class Map extends React.Component{
    render(){
        return(
            <div>
                {
                    let map=L.map(
                        'map',{
                            cen
                        }
                    )
                }
            </div>
        )
    }
}

export default Map;