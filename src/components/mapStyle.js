import { fromJS } from 'immutable'
import MAP_STYLE from './mapstyle.json'

export const trackLayer = fromJS({
  id: 'track',
  source: 'track',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#f02970',
    'line-width': 4,
  },
})

export const defaultMapStyle = fromJS(MAP_STYLE)
