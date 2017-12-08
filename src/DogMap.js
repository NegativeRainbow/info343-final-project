import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap defaultZoom={10} defaultCenter={{ lat: 47.6062, lng: -122.3321 }}>
    {Object.keys(this.props.parks).map((park) => {return(
      <Marker position={{ lat: park.geometry.location.lat, lng: park.geometry.location.lng }} />
    )})}
  </GoogleMap>
));

export default class DogMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
        parks: {0: {geometry: {lat: 47.6062, lng: -122.3321}}}
    }
  }

  componentWillMount(){
    console.log(fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query=dog+park&location=47.6062,-122.3321&radius=50000&key=AIzaSyD63XGCTwCWSN39vfCMY4GNScwKZlP2it4')
      .then((response) => {
        return(response.json());
      }).then( (response) => {
        console.log(response);
        this.setState({parks: response});
      }).catch( (error) => {
        console.log(error);
      }))
  }

  render(){return(
  <MyMapComponent
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoYbkKzAMKe3nCZFnFF849Xv7iYt454Dc&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
      parks={this.state.parks}
  />
  )};
}