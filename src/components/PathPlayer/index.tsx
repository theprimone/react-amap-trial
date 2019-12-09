import React from 'react';
import AMap from './AMap';
import Player from './Player';

export interface Path {
  path: [number, number];
  [k: string]: any;
}
export interface PathPlayerProps {
  height: React.CSSProperties['height'];
  path: Path[];
}

export default class extends React.Component<PathPlayerProps> {
  render() {
    const { height = '100vh', path } = this.props;
    return (
      <AMap height={height}>
        <Player path={path} />
      </AMap>
    );
  }
}
