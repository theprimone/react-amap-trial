import React from 'react';
import AMap from './AMap';
import Player, { PlayerProps } from './Player';

export interface PathPlayerProps extends Omit<PlayerProps, '__map__'> {
}

export default class extends React.Component<PathPlayerProps> {
  render() {
    const { panelWidth, height = '100vh', ...rest } = this.props;
    return (
      <AMap height={height} panelWidth={panelWidth}>
        <Player
          height={height}
          panelWidth={panelWidth}
          {...rest}
        />
      </AMap>
    );
  }
}
