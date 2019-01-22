import React from 'react'

const getTrackData = (fieldId) => {
  fetch(`/.netlify/functions/getGgsiesTrackData?fieldId=${fieldId}`).then((res) => {
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