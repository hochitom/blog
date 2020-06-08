import fetch from 'node-fetch' // todo: fix this another way
import React from 'react'
import MapGL from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import styled from 'styled-components'

import { defaultMapStyle, trackLayer } from './mapStyle.js'
import { fromJS } from 'immutable'

const token =
  'pk.eyJ1IjoiaG9jaGl0b20iLCJhIjoiY2pqeXhjdjJ4MDFpcTNxbWJqN2VsM29ybCJ9.j2ZpVbQgTetmRzXn_OUQ4w'

const mapApiUrls = {
  strava: `/.netlify/functions/getStravaActivity`,
  gpsies: `/.netlify/functions/getGpsiesTrackData`,
}

const apiMappings = {
  strava: {
    title: 'name',
    distance: 'distance',
    elevation: 'total_elevation_gain',
    duration: 'moving_time',
    geoJson: 'geoJson',
    bounds: 'bounds',
  },
  gpsies: {
    title: 'title',
    distance: 'trackLengthM',
    elevation: 'totalAscentM',
  },
}

const InlineMap = styled.div`
  position: relative;
  background: #f6f6f6;
  box-shadow: 0 0 4px rgba(0,0,0,.4), 0 0 20px rgba(0,0,0,.2);
`;

const InlineMapData = styled.div`
  position: absolute;
  padding: 10px;
  top: 0;
  left: 0;
  right: 0;
  color: #fff;
  text-shadow: 0 0 3px rgba(0,0,0,.4);
  background: rgb(0,0,0);
  background: linear-gradient(180deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,0) 100%);
  z-index: 100;
`;

const TrackTitle = styled.h2`
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: normal;
`;

const TrackData = styled.dl`
  display: grid;
  grid-template-columns: auto auto auto;
`;

const TrackDataItem = styled.div`
  max-width: 150px;
`;
const TrackDataLabel = styled.dt``;
const TrackDataEntry = styled.dd``;

export default class Map extends React.Component {
  trackId = this.props.id
  trackProvider = this.props.type

  state = {
    viewport: {
      latitude: 37.830348,
      longitude: -122.486052,
      zoom: 15,
    },
    mapStyle: defaultMapStyle, //'mapbox://styles/mapbox/outdoors-v10',
    trackData: {},
  }

  normalizeTrackData(data, provider) {
    if (data && data.track) {
      data = data.track
    }

    let output = {
      title: data[apiMappings[provider]['title']] || undefined,
      distance: data[apiMappings[provider]['distance']] || undefined,
      elevation: data[apiMappings[provider]['elevation']] || undefined,
      duration: data[apiMappings[provider]['duration']] || undefined,
      geoJson: data[apiMappings[provider]['geoJson']] || undefined,
      bounds: data[apiMappings[provider]['bounds']] || undefined,
    }

    return output
  }

  getTrackData(trackId, provider) {
    fetch(`${mapApiUrls[provider]}?id=${trackId}`)
      .then(response => response.json())
      .then(data => {
        const trackData = this.normalizeTrackData(data, provider)

        this.setState({
          ...this.state,
          trackData,
        })

        if (trackData.geoJson) {
          this._addTrack(trackData.geoJson)
        }

        if (trackData.bounds) {
          this._adjustBounds(trackData.bounds)
        }
      })

    if (provider === 'gpsies') {
      fetch(`/.netlify/functions/getGpsiesTrackGeojson?id=${trackId}`)
        .then(response => response.json())
        .then(data => {
          const box = data.features[0].geometry.bbox
          const coords = data.features[0].geometry.coordinates[0]

          this._addTrack(coords)
          this._adjustBounds(box);
        })
    }
  }

  _adjustBounds(bounds) {
    const viewport = new WebMercatorViewport(this.state.viewport)
    const { longitude, latitude, zoom } = viewport.fitBounds(
      [[bounds[2], bounds[3]], [bounds[0], bounds[1]]],
      { padding: 40 }
    )

    this.setState({
      viewport: {
        ...this.state.viewport,
        longitude,
        latitude,
        zoom,
      },
    })
  }

  renderLink(provider, id) {
    if (provider === 'strava') {
      return (
        <a href={`https://strava.com/activities/${id}`}>
          Aktivität auf strava.com anschauen
        </a>
      )
    } else if (provider === 'gpsies') {
      return (
        <a href={`https://www.gpsies.com/map.do?fileId=${id}`}>
          Tour auf gpsies.com anschauen
        </a>
      )
    }
  }

  componentDidMount() {
    this.getTrackData(this.trackId, this.trackProvider)
  }

  _addTrack = track => {
    let { mapStyle } = this.state
    if (!mapStyle.hasIn(['sources', 'track'])) {
      mapStyle = defaultMapStyle
        .setIn(
          ['sources', 'track'],
          fromJS({
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: track,
              },
            },
          })
        )
        .set('layers', defaultMapStyle.get('layers').push(trackLayer))
    }

    this.setState({ mapStyle })
  }

  _onViewportChange = viewport => this.setState({ viewport })

  renderTrackData() {
    const { viewport, mapStyle } = this.state

    return (
      <div>
        <InlineMapData>
          <TrackTitle>{this.state.trackData.title}</TrackTitle>

          <TrackData>
            <TrackDataItem>
              <TrackDataLabel>Distanz:</TrackDataLabel>
              <TrackDataEntry>{(this.state.trackData.distance / 1000).toFixed(2)} km</TrackDataEntry>
            </TrackDataItem>

            <TrackDataItem>
              <TrackDataLabel>Höhenmeter:</TrackDataLabel>
              <TrackDataEntry>{this.state.trackData.elevation} m</TrackDataEntry>
            </TrackDataItem>

            <TrackDataItem>
              <TrackDataLabel>Dauer:</TrackDataLabel>
              <TrackDataEntry>{(this.state.trackData.duration / 60 / 60).toFixed(2)} Stunden</TrackDataEntry>
            </TrackDataItem>
          </TrackData>
        </InlineMapData>

        <div>
          <MapGL
            {...viewport}
            width="100%"
            height="400px"
            mapStyle={mapStyle}
            onViewportChange={this._onViewportChange}
            mapboxApiAccessToken={token}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <InlineMap>
        {this.renderTrackData()}
        {/* {this.renderLink(this.trackProvider, this.trackId)} */}
      </InlineMap>
    )
  }
}
