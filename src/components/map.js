import React from 'react'

const mapApiUrl = `/.netlify/functions/getGpsiesTrackData`;
// const getTrackData = (fieldId) => {
//   fetch( `${mapApiUrl}?fieldId=${fieldId}`)
//   .then(response => response.json())
//   .then((data) => {
//     console.log(data.track);
//     this.trackData = data.track;
//   });
// };

export default class Map extends React.Component {
  trackId = this.props.id;
  trackDataLoaded = false;

  state = {}

  getTrackData(fieldId) {
    fetch( `${mapApiUrl}?fieldId=${fieldId}`)
      .then(response => response.json())
      .then((data) => {
        this.trackDataLoaded = true;
        this.setState(data.track);
      });
  }

  render() {
    if (this.trackDataLoaded === false) {
      this.getTrackData(this.trackId);
    }
    return (
      <div>
        <h2>{this.state.title}</h2>
        <p>{ (this.state.trackLengthM / 1000).toFixed(2)} km</p>
        <p>{this.state.totalAscentM} m</p>
        <a href={`http://www.gpsies.com/map.do?fileId=${this.trackId}`}>Tour auf gpsies.com anschauen</a>
      </div>
    )
  }
}