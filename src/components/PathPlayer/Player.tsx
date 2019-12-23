import React from 'react';
import ReactDOMServer from 'react-dom/server';
import styles from './Player.less';
import { PathData, IPathNavigatorIns, IPathSimplifierIns, IPathSimplifier } from '../props';

export interface PlayerProps {
  __map__?: any;
  colors?: string[];
  height: React.CSSProperties['height'];
  panelWidth?: React.CSSProperties['width'];
  getData: () => Promise<PathData[]> | PathData[];
  afterGetData?: (pathSimplifierIns: IPathSimplifierIns, amap: any) => void;
  renderItem: (item: PathData, index: number, getNavigator, pathSimplifierIns: IPathSimplifierIns) => JSX.Element;

  pathSimplifierProps?: IPathSimplifier;
  setPathNavigator?: (pathIndex: number, pathSimplifierIns: IPathSimplifierIns, PathSimplifier: IPathSimplifier, amap: any, navigators: (IPathNavigatorIns | null)[]) => IPathNavigatorIns;
}
interface PlayerState {
  data: PathData[];
}
export default class extends React.Component<PlayerProps, PlayerState> {
  amap: any;
  PathSimplifier: any;
  pathSimplifierIns: IPathSimplifierIns;
  navigators: (IPathNavigatorIns | null)[] = [];

  constructor(props: PlayerProps) {
    super(props);
    const { __map__: amap } = props;
    if (!amap) { throw new Error("PathPlayer has to be a child of Map component") }
    this.amap = amap;
    console.log('Player: loadUI');
    this.loadUI();
    this.state = {
      data: [],
    };
  }

  componentWillUnmount() {
    console.log('Player: unmount');
    this.pathSimplifierIns.clearPathNavigators();
  }

  loadUI() {
    const { getData, afterGetData = () => { } } = this.props;
    window.AMapUI.loadUI(['misc/PathSimplifier'], async (PathSimplifier) => {
      this.PathSimplifier = PathSimplifier;
      this.pathSimplifierIns = this.initPathSimplifier(PathSimplifier);

      const data = await getData();
      this.pathSimplifierIns.setData(data);
      afterGetData(this.pathSimplifierIns, this.amap);
      this.setState({
        data,
      });
    });
  }

  initPathSimplifier(PathSimplifier) {
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas！');
      return;
    }

    const { colors = ['blue'], pathSimplifierProps } = this.props;
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
          const color = colors[pathItem.pathIndex % colors.length];
          const lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));
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
      },
      ...pathSimplifierProps,
    });
  }

  initCallback = () => {
    console.log("AMapUI Loaded Done.")
  }

  //创建一个默认的轨迹巡航器
  setDefaultNavigator = (pathIndex: number) => {
    const navigator: IPathNavigatorIns = this.pathSimplifierIns.createPathNavigator(pathIndex, {
      loop: true,
      speed: 100000,
      // pathNavigatorStyle: {
      //   width: 16,
      //   height: 32,
      //   //使用图片
      //   content: this.PathSimplifier.Render.Canvas.getImageContent('https://webapi.amap.com/ui/1.0/ui/misc/PathSimplifier/examples/imgs/car.png'),
      // }
    });

    const markerContent = ReactDOMServer.renderToStaticMarkup(
      <div className={styles.markerInfo}>
        {this.pathSimplifierIns.getPathData(pathIndex).name}
      </div>
    )

    navigator.marker = new window.AMap.Marker({
      offset: new window.AMap.Pixel(12, -10),
      content: markerContent,
      map: this.amap,
    });

    navigator.on('move', function () {
      navigator.marker.setPosition(navigator.getPosition());
    });

    navigator.onDestroy(() => {
      this.navigators[pathIndex] = null;
      navigator.marker.setMap(null);
    });

    return navigator;
  }

  getNavigator = (pathIndex: number) => {
    if (!this.navigators[pathIndex]) {
      const { setPathNavigator } = this.props;
      let navigator: IPathNavigatorIns;
      if (setPathNavigator) {
        navigator = setPathNavigator(pathIndex, this.pathSimplifierIns, this.PathSimplifier, this.amap, this.navigators);
      } else {
        navigator = this.setDefaultNavigator(pathIndex);
      }
      this.navigators[pathIndex] = navigator;
    }
    return this.navigators[pathIndex];
  }

  render() {
    const { panelWidth, height, renderItem } = this.props;
    const { data } = this.state;
    return (
      <div className={!panelWidth ? styles['controls-container'] : undefined} style={{ maxHeight: height }}>
        {data && data.map((item, index) => {
          return renderItem(item, index, this.getNavigator, this.pathSimplifierIns);
        })}
      </div>
    );
  }
}
