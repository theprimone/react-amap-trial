import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Card, Radio, Slider } from 'antd';
import PathPlayer from '../../../components/PathPlayer';
import { IPathNavigatorIns, IPathSimplifierIns } from '../../../components/props';
import styles from './index.less';

let times = 6;
const dotInterval = 60; // unit: seconds

const navigBtnsConf = [{
  name: '开始巡航',
  action: 'start',
  enableExp: 'navgStatus === "stop" || navgStatus === "pause"'
}, {
  name: '暂停',
  action: 'pause',
  enableExp: 'navgStatus === "moving"'
}, {
  name: '恢复',
  action: 'resume',
  enableExp: 'navgStatus === "pause"'
}, {
  name: '停止',
  action: 'stop',
  enableExp: 'navgStatus === "moving"'
}, {
  name: '销毁',
  action: 'destroy',
  enableExp: 'navgExists'
}];

//just some colors
const colors = [
  "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
  "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
  "#651067", "#329262", "#5574a6", "#3b3eac"
];

let currentIdx = 0;

export default function () {
  useEffect(() => {
    currentIdx = 0;
  }, []);


  const getData = async () => {
    // const response = await fetch('https://a.amap.com/amap-ui/static/data/big-routes.json');
    // return await response.json();
    return [{
      name: '测试数据',
      path: [
        { "P": 22.539530357655636, "Q": 113.93521436499032, "lng": 113.935214, "lat": 22.53953 },
        { "P": 22.539492415192203, "Q": 113.93763358193974, "lng": 113.937634, "lat": 22.539492 },
        { "P": 22.539850845046576, "Q": 113.9439151798706, "lng": 113.943915, "lat": 22.539851 },
        { "P": 22.539850845046576, "Q": 113.9439151798706, "lng": 113.943915, "lat": 22.539851 },
        { "P": 22.539850845046576, "Q": 113.9439151798706, "lng": 113.943915, "lat": 22.539851 },
        { "P": 22.539850845046576, "Q": 113.9439151798706, "lng": 113.943915, "lat": 22.539851 },
        { "P": 22.54011830540123, "Q": 113.9574846296997, "lng": 113.957485, "lat": 22.540118 },
        { "P": 22.538269473300453, "Q": 113.95838485192866, "lng": 113.958385, "lat": 22.538269 },
        { "P": 22.53250914005226, "Q": 113.95531590481568, "lng": 113.955316, "lat": 22.532509 },
        { "P": 22.525833119685796, "Q": 113.95457823483662, "lng": 113.954578, "lat": 22.525833 },
        { "P": 22.523041747337032, "Q": 113.95401222623445, "lng": 113.954012, "lat": 22.523042 },
        { "P": 22.521185281807718, "Q": 113.95202190214536, "lng": 113.952022, "lat": 22.521185 },
        { "P": 22.521595148631857, "Q": 113.95027285186768, "lng": 113.950273, "lat": 22.521595 },
        { "P": 22.521791936725062, "Q": 113.94399623277286, "lng": 113.943996, "lat": 22.521792 },
        { "P": 22.521513016089028, "Q": 113.93737629092408, "lng": 113.937376, "lat": 22.521513 },
        { "P": 22.522382299323137, "Q": 113.9313461850586, "lng": 113.931346, "lat": 22.522382 },
        { "P": 22.522757475779237, "Q": 113.92995118637089, "lng": 113.929951, "lat": 22.522757 },
        { "P": 22.524559754921253, "Q": 113.92924283319093, "lng": 113.929243, "lat": 22.52456 },
        { "P": 22.528084961587826, "Q": 113.92949982525636, "lng": 113.9295, "lat": 22.528085 },
        { "P": 22.530139435352062, "Q": 113.9307747273865, "lng": 113.930775, "lat": 22.530139 },
        { "P": 22.53322790817226, "Q": 113.93201299327086, "lng": 113.932013, "lat": 22.533228 },
        { "P": 22.536278378556375, "Q": 113.93194548070528, "lng": 113.931945, "lat": 22.536278 },
        { "P": 22.53952696803616, "Q": 113.93192088348388, "lng": 113.931921, "lat": 22.539527 }
      ].map(item => [item.lng, item.lat]) as any
    }]
  }

  const calcSpeed = (pathIndex: number, pathSimplifierIns: IPathSimplifierIns) => (start, step = 1) => {
    const pathData = pathSimplifierIns.getPathData(pathIndex);
    const distance = window.AMap.GeometryUtil.distance(pathData.path[start], pathData.path[start + step]);  // unit: m
    const speed = (distance / 1000) / (dotInterval / 60 / 60);  // km/h
    return speed * times;  // 乘以放大倍数
  }

  /**
   * 高德地图渲染重复数据点的，只会渲染一个点，且该点的 idx 为最后一个数据点的 idx
   * 
   * @param navigator 
   * @param pathSimplifierIns 
   */
  const onMove = (navigator: IPathNavigatorIns, pathSimplifierIns: IPathSimplifierIns) => {
    const { idx } = navigator.getCursor();
    // console.log(idx, currentIdx);
    if (idx === currentIdx + 1) {
      const nextSpeed = calcSpeed(navigator.getPathIndex(), pathSimplifierIns)(idx);
      console.log('nextSpeed', nextSpeed, 'km/h');
      navigator.setSpeed(nextSpeed);

      currentIdx = idx;
    } else if (idx > currentIdx + 1) {
      navigator.setSpeed(0);
      const intervalSeconds = (idx - currentIdx - 1) * dotInterval * 1000;
      const timer = setTimeout(() => {
        const nextSpeed = calcSpeed(navigator.getPathIndex(), pathSimplifierIns)(idx);
        console.log('nextSpeed', nextSpeed, 'km/h');
        navigator.setSpeed(nextSpeed);

        currentIdx = idx;
        clearTimeout(timer);
      }, intervalSeconds / times);
    }
  }

  const setPathNavigator = (pathIndex: number, pathSimplifierIns: IPathSimplifierIns, PathSimplifier: any, amap, navigators: (IPathNavigatorIns | null)[]) => {
    const initSpeed = calcSpeed(pathIndex, pathSimplifierIns)(0);
    console.log('initSpeed', initSpeed, 'km/h');
    const navigator: IPathNavigatorIns = pathSimplifierIns.createPathNavigator(pathIndex, {
      loop: true,
      speed: initSpeed,
      pathNavigatorStyle: {
        width: 16,
        height: 32,
        //使用图片
        content: PathSimplifier.Render.Canvas.getImageContent('https://webapi.amap.com/ui/1.0/ui/misc/PathSimplifier/examples/imgs/car.png'),
      },
    });


    const setMarkerContent = (extra?: any) => ReactDOMServer.renderToStaticMarkup(
      <div className={styles.markerInfo}>
        {pathSimplifierIns.getPathData(pathIndex).name} {extra}
      </div>
    )

    navigator.marker = new window.AMap.Marker({
      offset: new window.AMap.Pixel(12, -10),
      content: setMarkerContent(),
      map: amap,
    });

    navigator.on('move', function () {
      navigator.marker.setPosition(navigator.getPosition());
      onMove(navigator, pathSimplifierIns);
      const { idx, tail } = navigator.getCursor();
      const speed = navigator?.getSpeed() / times;
      navigator.marker.setContent(
        setMarkerContent(<div>
          <b>{`${speed.toFixed(2)} km/h`}</b><br />
          <b>{`times: ${times}`}</b><br />
          {`idx: ${idx}`}<br />
          {`tail: ${tail.toFixed(2)}`}<br />
        </div>)
      );
    });

    navigator.onDestroy(() => {
      navigators[pathIndex] = null;
      navigator.marker.setMap(null);
    });

    return navigator;
  }

  return (
    <div>
      <PathPlayer
        height='calc(100vh - 10px)'
        panelWidth={400}
        getData={getData}
        colors={colors}
        setPathNavigator={setPathNavigator}
        renderItem={(item, index, getNavigator, pathSimplifierIns) => {
          return (
            <Card key={item.name}>
              <h3
                style={{ color: colors[index] }}
                onClick={() => {
                  pathSimplifierIns.setSelectedPathIndex(index)
                }}
              >
                {`${item.name}（点数：${item.path.length}）`}
              </h3>
              <Radio.Group
                buttonStyle='solid'
                onChange={(e) => {
                  const navigator = getNavigator(index);
                  navigator[e.target.value]();
                }}
              >
                {navigBtnsConf.map(item => {
                  return (
                    <Radio.Button
                      key={item.action}
                      value={item.action}
                    >
                      {item.name}
                    </Radio.Button>
                  )
                })}
              </Radio.Group>
              <Slider
                min={1}
                max={60}
                step={6}
                defaultValue={6}
                onChange={(value) => {
                  times = Array.isArray(value) ? value[0] : value;
                }}
              />
              km/h
            </Card>
          )
        }}
      />
    </div>
  )
}
