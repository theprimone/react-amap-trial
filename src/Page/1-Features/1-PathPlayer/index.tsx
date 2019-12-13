import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Card, Radio, Slider } from 'antd';
import PathPlayer from '../../../components/PathPlayer';
import { IPathNavigatorIns, IPathSimplifierIns } from '../../../components/props';
import styles from './index.less';

const rate = 6;
const dotInterval = 60; // seconds

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
      name: 'test',
      path: [
        { "P": 22.521236546850297, "Q": 113.95209082411202, "lng": 113.952091, "lat": 22.521237 },
        { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        // { "P": 22.52138690124636, "Q": 113.94601816732029, "lng": 113.946018, "lat": 22.521387 },
        { "P": 22.524355947191072, "Q": 113.94611465905382, "lng": 113.946115, "lat": 22.524356 },
        { "P": 22.529289187357175, "Q": 113.94611998957635, "lng": 113.94612, "lat": 22.529289 },
        { "P": 22.532707086089108, "Q": 113.94612265483761, "lng": 113.946123, "lat": 22.532707 },
        { "P": 22.536283453124206, "Q": 113.94552450527954, "lng": 113.945525, "lat": 22.536283 },
        { "P": 22.539622840772992, "Q": 113.94518938357544, "lng": 113.945189, "lat": 22.539623 },
        { "P": 22.539958276964086, "Q": 113.94775157539368, "lng": 113.947752, "lat": 22.539958 },
        { "P": 22.54002690197606, "Q": 113.95051325067902, "lng": 113.950513, "lat": 22.540027 },
        { "P": 22.53986302874934, "Q": 113.95200137668229, "lng": 113.952001, "lat": 22.539863 },
        { "P": 22.540016252719848, "Q": 113.95769520642091, "lng": 113.957695, "lat": 22.540016 },
        { "P": 22.540425622823697, "Q": 113.95950655035404, "lng": 113.959507, "lat": 22.540426 },
        { "P": 22.53642872656097, "Q": 113.95723648684691, "lng": 113.957236, "lat": 22.536429 },
        { "P": 22.532606841325972, "Q": 113.95601562440493, "lng": 113.956016, "lat": 22.532607 },
        { "P": 22.527683201086674, "Q": 113.95489020905302, "lng": 113.95489, "lat": 22.527683 },
        { "P": 22.522838669485093, "Q": 113.95410811645507, "lng": 113.954108, "lat": 22.522839 }
      ].map(item => [item.lng, item.lat]) as any
    }]
  }

  const calcSpeed = (pathIndex: number, pathSimplifierIns: IPathSimplifierIns) => (start, step = 1) => {
    const pathData = pathSimplifierIns.getPathData(pathIndex);
    const distance = window.AMap.GeometryUtil.distance(pathData.path[start], pathData.path[start + step]);  // unit: m
    return (distance / 1000) / (dotInterval / 60 / 60) * rate;
  }

  const onMove = (navigator: IPathNavigatorIns, pathSimplifierIns: IPathSimplifierIns) => {
    const { idx } = navigator.getCursor();
    console.log(idx, currentIdx);
    if (idx === currentIdx + 1) {
      const nextSpeed = calcSpeed(navigator.getPathIndex(), pathSimplifierIns)(idx);
      console.log('nextSpeed', nextSpeed, 'km/h');
      navigator.setSpeed(nextSpeed);

      currentIdx = idx;
    } else if (idx > currentIdx + 1) {
      navigator.setSpeed(0);
      const timer = setTimeout(() => {
        const nextSpeed = calcSpeed(navigator.getPathIndex(), pathSimplifierIns)(idx);
        console.log('nextSpeed', nextSpeed, 'km/h');
        navigator.setSpeed(nextSpeed);

        currentIdx = idx;
        clearTimeout(timer);
      }, (idx - currentIdx) * (dotInterval * 1000) / rate);
    }
  }

  const setPathNavigator = (pathIndex: number, pathSimplifierIns: IPathSimplifierIns, PathSimplifier: any, amap, navigators) => {
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

    const markerContent = ReactDOMServer.renderToStaticMarkup(
      <div className={styles.markerInfo}>
        {pathSimplifierIns.getPathData(pathIndex).name}
      </div>
    )

    navigator.marker = new window.AMap.Marker({
      offset: new window.AMap.Pixel(12, -10),
      content: markerContent,
      map: amap,
    });

    navigator.on('move', function () {
      navigator.marker.setPosition(navigator.getPosition());
      onMove(navigator, pathSimplifierIns);
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
                min={1000}
                max={1000000}
                step={1000}
                defaultValue={100000}
                onChange={(value) => {
                  const navigator = getNavigator(index);
                  navigator.setSpeed(value);
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
