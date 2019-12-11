import React from 'react';
import { Card, Radio, Slider } from 'antd';
import PathPlayer from '../../../components/PathPlayer';
// import styles from './index.less';

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

export default function () {

  const getData = async () => {
    const response = await fetch('https://a.amap.com/amap-ui/static/data/big-routes.json');
    return await response.json();
  }

  return (
    <div>
      <PathPlayer
        height='calc(100vh - 10px)'
        panelWidth={400}
        getData={getData}
        colors={colors}
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
