import React from 'react'
import fetch from 'node-fetch' // todo: fix this another way
import ReactMapGL from 'react-map-gl';

const token = 'pk.eyJ1IjoiaG9jaGl0b20iLCJhIjoiY2pqeXhjdjJ4MDFpcTNxbWJqN2VsM29ybCJ9.j2ZpVbQgTetmRzXn_OUQ4w';

const mapApiUrls = {
  strava: `/.netlify/functions/getStravaActivity`,
  gpsies: `/.netlify/functions/getGpsiesTrackData`
};

const apiMappings = {
  strava: {
    title: 'name',
    distance: 'distance',
    elevation: 'total_elevation_gain',
    duration: 'moving_time'
  },
  gpsies: {
    title: 'title',
    distance: 'trackLengthM',
    elevation: 'totalAscentM'
  }
}

export default class Map extends React.Component {
  trackId = this.props.id;
  trackProvider = this.props.type;
  trackDataLoaded = false;

  state = {
    viewport: {
      width: 920,
      height: 400,
      latitude: 47.5054727,
      longitude: 15.4491151,
      zoom: 13
    },
    trackData: {}
  }

  normalizeTrackData(data, provider) {
    if (data && data.track) {
      data = data.track;
    }

    let output = {
      title: data[apiMappings[provider]['title']] || undefined,
      distance: data[apiMappings[provider]['distance']] || undefined,
      elevation: data[apiMappings[provider]['elevation']] || undefined,
      duration: data[apiMappings[provider]['duration']] || undefined
    };

    return output;
  }

  getTrackData(trackId, provider) {
    fetch( `${mapApiUrls[provider]}?id=${trackId}`)
      .then(response => response.json())
      .then((data) => {
        this.trackDataLoaded = true;
        this.setState({
          ...this.state,
          trackData: this.normalizeTrackData(data, provider)
        });
      });
  }

  renderTrackData() {
    return (
      <div>
        <h2>{this.state.trackData.title}</h2>
        <div>
          <dl>
            <dt>Distanz:</dt>
            <dd>{ (this.state.trackData.distance / 1000).toFixed(2) } km</dd>

            <dt>Höhenmeter:</dt>
            <dd>{this.state.trackData.elevation} m</dd>

            <dt>Dauer:</dt>
            <dd>{ (this.state.trackData.duration / 60 / 60).toFixed(2) } Stunden</dd>
          </dl>
        </div>

        <div>
          {/* <ReactMapGL className="map" {...this.state.viewport} onViewportChange={(viewport) => this.setState({viewport})} mapboxApiAccessToken={token} /> */}
        </div>
      </div>
    )
  }

  render() {
    if (this.trackDataLoaded === false) {
      this.getTrackData(this.trackId, this.trackProvider);
    }
    return (
      <div>
        { this.trackDataLoaded === true ? this.renderTrackData() : ''}
        <a href={`http://www.gpsies.com/map.do?fileId=${this.trackId}`}>Tour auf gpsies.com anschauen</a>
      </div>
    )
  }
}