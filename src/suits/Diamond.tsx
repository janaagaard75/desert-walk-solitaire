import * as React from 'react'
import { Component } from 'react'
import { Svg } from 'expo'

import { Settings } from '../Settings'

interface Props {
  /** Height and width. */
  size: number
}

export class Diamond extends Component<Props, {}> {
  public render() {
    return (
      <Svg
        height={this.props.size}
        viewBox="0 0 60 60"
        width={this.props.size}
      >
        <Svg.G>
          <Svg.Path
            d="M30.005,-0 L7.244,29.589 L30.005,60 L52.766,29.589 z"
            fill={Settings.instance.colors.card.diamonds}
          />
        </Svg.G>
      </Svg>
    )
  }
}