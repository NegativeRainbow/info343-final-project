import React, { Component } from 'react';
import { compose, withProps, withStateHandlers } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
let parkData = require('./parks.json').results;
console.log(parkData);

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDoYbkKzAMKe3nCZFnFF849Xv7iYt454Dc&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
    <GoogleMap defaultZoom={10} defaultCenter={{ lat: 47.6062, lng: -122.3321 }}>
    {props.parks.map((park) => {return(
      <Marker key={park.name} position={{ lat: park.geometry.location.lat, lng: park.geometry.location.lng }} />
    )})}
    </GoogleMap>
)

export default class DogMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
        parks: parkData
    }
  }

  render() {
    return (
      <MyMapComponent
        parks={this.state.parks}
      />
    )
  }
}