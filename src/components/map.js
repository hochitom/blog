import React from 'react'
import fetch from 'node-fetch'

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

  renderTrackData() {
    return (
      <div>
        <h2>{this.state.title}</h2>
        <dl>
          <dt>Distanz:</dt>
          <dd>{ (this.state.trackLengthM / 1000).toFixed(2)} km</dd>

          <dt>Distanz:</dt>
          <dd>{this.state.totalAscentM} m</dd>
      </dl>
      </div>
    )
  }

  render() {
    if (this.trackDataLoaded === false) {
      this.getTrackData(this.trackId);
    }
    return (
      <div>
        { this.trackDataLoaded === true ? this.renderTrackData() : ''}
        <a href={`http://www.gpsies.com/map.do?fileId=${this.trackId}`}>Tour auf gpsies.com anschauen</a>
      </div>
    )
  }
}