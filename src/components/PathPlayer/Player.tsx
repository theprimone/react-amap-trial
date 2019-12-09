import React from 'react';
import { Card } from 'antd';
import styles from './Player.less'

//just some colors
const colors = [
  "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
  "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
  "#651067", "#329262", "#5574a6", "#3b3eac"
];

export interface Path {
  path: [number, number];
  [k: string]: any;
}
export interface PathPlayerProps {
  __map__?: any;
  path: Path[];
}

export default class extends React.Component<PathPlayerProps> {
  amap: any;
  pathSimplifier: any;

  constructor(props: PathPlayerProps) {
    super(props);
    const { __map__: amap } = props;
    if (!amap) { throw new Error("PathPlayer has to be a child of Map component") }
    this.amap = amap;
    this.loadUI();
  }

  loadUI() {
    window.AMapUI.loadUI(['misc/PathSimplifier'], (PathSimplifier) => {
      this.pathSimplifier = this.initPathSimplifier(PathSimplifier);
    })
  }

  initPathSimplifier(PathSimplifier) {
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas！');
      return;
    }

    return new PathSimplifier({
      zIndex: 100,
      //autoSetFitView:false,
      map: this.amap, //所属的地图实例

      getPath: function (pathData, pathIndex) {

        return pathData.path;
      },
      getHoverTitle: function (pathData, pathIndex, pointIndex) {

        if (pointIndex >= 0) {
          //point 
          return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
        }

        return pathData.name + '，点数量' + pathData.path.length;
      },
      renderOptions: {
        pathLineStyle: {
          dirArrowStyle: true
        },
        getPathStyle: function (pathItem, zoom) {

          const color = colors[pathItem.pathIndex],
            lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));

          return {
            pathLineStyle: {
              strokeStyle: color,
              lineWidth: lineWidth
            },
            pathLineSelectedStyle: {
              lineWidth: lineWidth + 2
            },
            pathNavigatorStyle: {
              fillStyle: color
            }
          }
        }
      }
    });
  }

  initCallback = () => {
    console.log("AMapUI Loaded Done.")
  }

  render() {
    const { path } = this.props;
    console.log(path)
    if (this.pathSimplifier && Array.isArray(path) && path.length) {
      this.pathSimplifier.setData(path);
    }
    return (
      <div className={styles['controls-container']}>
        <Card>
          asdf
        </Card>
      </div>
    );
  }
}
