import React from 'react'

class RightSection extends React.Component{

    render(){
       return (<div>
           <div className="overlay ui-front roadInfo">
        <input className="form-control" placeholder="Search for an address" />
        <h2 className="roadName">12</h2>
       
        
        <div className="progressBar"></div>
        <ol className="riskRank"></ol>

    </div>
       </div>)

    }
}
export default RightSection