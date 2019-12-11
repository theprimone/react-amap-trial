export interface LngLat {
  lng: number;
  lat: number;
  noAutofix?: boolean;
}

export interface Poi {
  adcode: string;
  address: string;
  city: [];
  district: string;
  id: string;
  location: {
    P: number,
    Q: number,
  } & LngLat | '';
  name: string;
  typecode: string;
}

export type NavigatorStatus = 'start' | 'resume' | 'stop' | 'pause' | 'move';

// ref: https://lbs.amap.com/api/javascript-api/reference-amap-ui/mass-data/pathsimplifier#interface
// 轨迹展示
export interface IPathSimplifier {
  /** 地图对象实例，用于显示相关的Marker */
  map: any;
  /** 绘制用图层的叠加顺序值 。如果需要叠加在地图的最上层，可以设置一个较大的值，比如300 */
  zIndex?: number;
  /** 数据源数组，每个元素即为轨迹相关的信息 */
  data?: [number, number][];
  /**
   * 返回轨迹数据中的路径信息
   * 
   * @param  {*} pathData 轨迹数据项
   * @param  {number} pathIndex 轨迹索引
   */
  getPath?: (pathData: any, pathIndex: number) => (LngLat | [number, number])[];
  /** 返回轨迹数据项的叠加顺序值，即zIndex。zIndex较大的轨迹绘制在上层; 如果zIndex值相同，则pathIndex较大的绘制在上层。默认返回 100 */
  getZIndex?: (pathData: any, pathIndex: number) => number;
  /** 返回鼠标悬停时显示的Title内容 */
  getHoverTitle?: (pathData, pathIndex, pointIndex) => string;
  /** 是否在绘制后自动调整地图视野以适合全部轨迹，默认true。 */
  autoSetFitView?: boolean;
  /** 点击轨迹节点或者轨迹节点间的连线时，选中该轨迹，默认true。 */
  clickToSelectPath?: boolean;
  /** 置顶选中的轨迹线；置顶的含义是，将该轨迹线的zIndex设置为现存最大值+1。默认true。 */
  onTopWhenSelected?: boolean;
  /** 绘制引擎的构造类（Function），默认为内置的Canvas引擎 */
  renderConstructor?: any;
  /** 绘制引擎的构造参数，请参见下方 绘制引擎 部分 */
  renderOptions?: RenderOptions;
}

export type PathItem = LngLat | [number, number];

export interface PathData {
  path: PathItem[];
  [k: string]: any;
}

export interface IPathSimplifierIns {
  /** 返回pathIndex对应的轨迹数据项的zIndex值 */
  getZIndexOfPath: (pathIndex: number) => number;
  /** 设置pathIndex对应的轨迹数据项的zIndex值 */
  setZIndexOfPath: (pathIndex: number, zIndex: number) => void;
  /** 
   * 是否置顶显示pathIndex对应的轨迹。具体行为是：
   * 
   * 1. isTop为真，设置 zIndex 为 现存最大zIndex+1
   * 2. isTop为假，设置 zIndex 为 构造参数中 getZIndex 的返回值
   */
  toggleTopOfPath: (pathIndex: number, isTop: boolean) => void;
  /** 返回pathIndex对应的轨迹数据项 */
  getPathData: (pathIndex: number) => any;
  /** 创建一个轨迹巡航器 */
  createPathNavigator: (pathIndex: number, options: IPathNavigator) => IPathNavigatorIns;
  /** 返回现存的所有轨迹巡航器（已创建未销毁） */
  getPathNavigators: () => IPathNavigatorIns[];
  /** 销毁现存的所有轨迹巡航器 */
  clearPathNavigators: () => void;
  /** 返回处于选中状态的轨迹数据项；无选中时，返回null */
  getSelectedPathData: () => any;
  /** 返回处于选中状态的的pathIndex；无选中时，返回-1 */
  getSelectedPathIndex: () => number;
  /** 判断pathIndex对应的轨迹是否处于选中状态 */
  isSelectedPathIndex: (pathIndex: number) => boolean;
  /** 选中（单选）pathIndex对应的轨迹；pathIndex < 0等同于清除选中状态 */
  setSelectedPathIndex: (pathIndex: number) => void;
  /** 立即重新绘制 */
  render: () => void;
  /** 延时设定的毫秒(默认10)后绘制；该时间段内重复调用只会触发一次。该函数适合短时间内多次触发绘制的场景 */
  renderLater: (delay?: number) => void;
  /** 设定数据源数组，并触发重新绘制。data为空时将清除显示内容 */
  setData: (data: PathData[]) => void;
  /** 
   * 自动调整地图视野，适应pathIndex对应的轨迹线。
   * 如果pathIndex < 0, 则适应全部的轨迹线。
   */
  setFitView: (pathIndex: number) => void;
  /** 监听 eventName 事件，多个事件用空格分隔 */
  on: (eventName: string, handler: Function) => void;
  /** 注销 eventName 事件，多个事件用空格分隔 */
  off: (eventname: string, handler: Function) => void;
  /** 隐藏 */
  hide: () => void;
  /** 显示 */
  show: () => void;
  /** 返回是否处于隐藏状态 */
  isHidden: () => boolean;
  /** 返回内部使用的绘制引擎的实例 */
  getRender: () => any;
  /** 返回内部绘制引擎的参数选项的引用。更改后，调用renderLater()方法重新绘制即可生效 */
  getRenderOptions: () => RenderOptions;
}

// ref: https://lbs.amap.com/api/javascript-api/reference-amap-ui/mass-data/pathsimplifier#render
export interface RenderOptions {
  /** 是否支持事件（click，mouseover，mouseout），默认为True。事件监听本身对性能有一定的损耗，如果不需要，可以关闭。 */
  eventSupport?: any;
  /** 对轨迹线上不可见（参见keyPointTolerance）的节点，是否支持事件，默认为True。 */
  eventSupportInvisible?: any;
  /** 绘制轨迹线的简化参数，默认为2。该参数不宜设置过大，推荐范围 1~5。过大的参数会导致鼠标识别以及轨迹巡航偏离轨迹线 */
  pathTolerance?: any;
  /**
   * 绘制中间节点的简化参数，取值规则如下：
   *
   * 1. 小于0, 不绘制任何中间节点；默认设置。
   * 2. 大于等于0，对简化过的绘制轨迹线做二次简化，结果以点的形式绘制（入下图中的蓝色圆点）
   */
  keyPointTolerance?: any;
  /** 如果地图视野内的轨迹节点的总数量小于该阈值，则绘制全部的节点。默认值为-1，即不开启。开启时，建议设置一个1000以内的数值。 */
  renderAllPointsIfNumberBelow?: any;
  /** 轨迹线的样式  */
  pathLineStyle?: any;
  /** 轨迹线在鼠标Hover时的样式，属性继承 pathLineStyle */
  pathLineHoverStyle?: any;
  /** 轨迹线处于选中状态时的样式， 属性继承 pathLineStyle */
  pathLineSelectedStyle?: any;
  /** 轨迹线上方向箭头的默认配置（pathLine***Style中可覆盖），属性继承 pathLineStyle */
  dirArrowStyle?: any;
  /** 轨迹节点的绘制样式 */
  keyPointStyle?: any;
  /** 轨迹起点的绘制样式，属性继承  keyPointStyle */
  startPointStyle?: any;
  /** 轨迹终点的绘制样式，属性继承  keyPointStyle */
  endPointStyle?: any;
  /** 轨迹点在鼠标Hover时的样式 ，属性继承  keyPointStyle */
  keyPointHoverStyle?: any;
  /** 选中状态下的轨迹线上的节点的样式， 属性继承 keyPointStyle */
  keyPointOnSelectedPathLineStyle?: any;
  /** 轨迹巡航器的默认样式 */
  pathNavigatorStyle?: any;
  /** 根据轨迹索引和zoom返回样式配置 */
  getPathStyle?: any;
  /** 鼠标Hover时显示的Title的样式 */
  hoverTitleStyle?: any;
}

// ref: https://lbs.amap.com/api/javascript-api/reference-amap-ui/mass-data/pathsimplifier#PathNavigator
export interface IPathNavigator {
  /** 是否循环回放（到达终点后，返回起点重新开始），默认false */
  loop?: boolean;
  /** 巡航速度，单位 千米/小时。默认 1000 */
  speed?: number;
  /** 巡航器的样式，属性继承上述绘制引擎部分的  pathNavigatorStyle 参数 */
  pathNavigatorStyle?: any;
  /** 动画触发的间隔，单位毫秒；默认16。该值只是建议性质，较大的间隔有助于降低资源消耗，但同时也会降低动画的流畅度，通常情况下保持原值即可 */
  animInterval?: number;
  /** 该值默认200，单位毫秒。该值会影响巡航器行进中的方向指向 */
  dirToPosInMillsecs?: number;
  /** 巡航路径的节点索引范围，默认为[0, 路径长度-1]，即整条路径 */
  range?: [number, number];
}

export interface IPathNavigatorIns {
  /** 开始路径巡航。 pointIndex用于指定巡航的起始节点索引，默认为节点索引范围（range）的最小值 */
  start: (pointIndex: number) => void;
  /** 暂停巡航 */
  pause: () => void;
  /** 恢复巡航 */
  resume: () => void;
  /** 停止巡航，同时清除已经过路径（这一点不同于pause） */
  stop: () => void;
  /** 销毁巡航器。巡航作为动画过程是非常耗费性能的，因此不再需要时应及时销毁 */
  destroy: () => void;
  /** 
   * 返回当前所处的索引位置。返回属性为:
   * 
   * {
   *   idx: {number}， 节点索引
   *   tail: {number}，至下一个节点的比例位置
   * }
   * 
   * 比如{idx: 1, tail:0.5}就表示当前处于节点1到节点2的中间位置
   */
  getCursor: () => { idx: number, tail: number };
  /** 
   * 返回巡航状态，有三种：
   * stop：停止状态，start之前或者stop之后处于该状态
   * moving：巡航状态，start或者resume之后处于该状态
   * pause：暂停状态，pause之后处于该状态
   */
  getNaviStatus: () => 'stop' | 'moving' | 'pause';
  /** 返回巡航路径的轨迹索引，即 创建（createPathNavigator）时 传入的第一个参数 */
  getPathIndex: () => number;
  /** 返回当前位置的经纬度 */
  getPosition: () => LngLat;
  /** 返回当前设定的速度 */
  getSpeed: () => number;
  /** 返回巡航经过的距离(起始节点到当前位置)，单位米；stop后会重置为0 */
  getMovedDistance: () => number;
  /** 返回巡航路径的起始节点索引 */
  getPathStartIdx: () => number;
  /** 返回巡航路径的结束节点索引 */
  getPathEndIdx: () => number;
  /** 将巡航器移动指定的距离，单位米 */
  moveByDistance: (distance: number) => void;
  /** 将巡航器移动到指定的节点索引位置，tail含义见getCursor */
  moveToPoint: (idx: number, tail: number) => void;
  isCursorAtPathEnd(): () => boolean;
  isCursorAtPathStart(): () => boolean;
  /** 设定巡航器的速度，单位千米/小时 */
  setSpeed: (speed: number) => void;
  /** 设定巡航器的路径节点索引范围 */
  setRange: (startIndex: number, endIndex: number) => void;
  /** 监听 eventName 事件，多个事件用空格分隔 */
  on: (eventName: string, handler: Function) => void;
  /** 注销 eventName 事件，多个事件用空格分隔  */
  off: (eventname: string, handler: Function) => void;

  marker: any;
  onDestroy: (callbak: () => void) => void;
  [k: string]: any;
}