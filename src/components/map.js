import React from 'react'
import fetch from 'node-fetch'

const mapApiUrl = '/.netlify/functions/getGpsiesTrackData';
const getTrackData = (fieldId) => {
  fetch( `${mapApiUrl}?fieldId=${fieldId}`).then((res) => {
    console.log(res);
    this.trackData = res;
  });
};

export default class Map extends React.Component {
  trackId = this.props.id;

  trackData = {}

  render() {
    getTrackData(this.trackId);

    return (
      <div>
        <a href={`http://www.gpsies.com/map.do?fileId=${this.trackId}`}>Tour auf gpsies.com anschauen</a>
      </div>
    )
  }
}