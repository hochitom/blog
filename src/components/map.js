import React from "react"

export default class Map extends React.Component {
  static defaultProps = {
    id: 0,
  }

  state = {
    id: this.props.id,
  }

  render() {
    return (
      <div>
        <h1>My GPSies Track: {this.state.id}</h1>
        <a href={`http://www.gpsies.com/map.do?fileId=${this.state.id}`}>Tour auf gpsies.com anschauen</a>
      </div>
    )
  }
}