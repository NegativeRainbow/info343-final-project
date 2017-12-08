import { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap defaultZoom={10} defaultCenter={{ lat: 47.6062, lng: -122.3321 }}>
    <Marker position={{ lat: 47.6062, lng: -122.3321 }} />
  </GoogleMap>
));

export default class DogMap extends Component {
    render(){return(
    <MyMapComponent
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoYbkKzAMKe3nCZFnFF849Xv7iYt454Dc&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
    />
    )};
}