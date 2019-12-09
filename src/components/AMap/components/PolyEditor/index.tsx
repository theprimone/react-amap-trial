import React from 'react';
import { Polygon, Polyline, PolyEditor } from 'react-amap';
import { LngLat } from '../../../Props';

export interface PolyEditorProps {
  __map__?: any;
  onSubmit?: (path: LngLat[]) => void;
}
export default class extends React.Component<PolyEditorProps, any> {
  editorEvents: {
    created?: (ins: any) => void;
    // addnode: () => void;
    // adjust: () => void;
    // removenode: () => void;
    end: (e: any) => void;
  };
  linePath: { longitude: number; latitude: number; }[];
  polygonPath: { longitude: number; latitude: number; }[];
  mapCenter: { longitude: number; latitude: number; };

  constructor(props: PolyEditorProps) {
    super(props);
    const { __map__: amap, onSubmit = () => { } } = props;
    if (!amap) { throw new Error("PolyEditor has to be a child of Map component") }

    this.state = {
      lineActive: true,
      polygonActive: true,
    };

    this.editorEvents = {
      // created: (ins) => { console.log(ins) },
      // addnode: () => { console.log('polyeditor addnode') },
      // adjust: () => { console.log('polyeditor adjust') },
      // removenode: () => { console.log('polyeditor removenode') },
      end: (e) => {
        console.log('polyeditor end')
        console.log(e);
        console.log(e.target.Ge.path);
        onSubmit(e.target.Ge.path);
      },
    };

    this.linePath = [
      { longitude: 150, latitude: 20 },
      { longitude: 170, latitude: 20 },
      { longitude: 150, latitude: 30 },
    ];

    this.polygonPath = [
      { longitude: 120, latitude: 30 },
      { longitude: 130, latitude: 30 },
      { longitude: 120, latitude: 40 },
    ];

    this.mapCenter = { longitude: 145, latitude: 30 }
  }

  togglePolyline() {
    this.setState({
      lineActive: !this.state.lineActive
    });
  }

  togglePolygon() {
    this.setState({
      polygonActive: !this.state.polygonActive
    });
  }

  render() {
    return (
      <>
        <Polygon path={this.polygonPath} {...this.props}>
          <PolyEditor active={this.state.polygonActive} events={this.editorEvents} />
        </Polygon>
        <Polyline path={this.linePath} {...this.props}>
          <PolyEditor active={this.state.lineActive} />
        </Polyline>
        <button onClick={() => { this.togglePolyline() }} >Toggle Polyline Editable</button>
        <button onClick={() => { this.togglePolygon() }} >Toggle Polygon Editable</button>
      </>
    )
  }
}
