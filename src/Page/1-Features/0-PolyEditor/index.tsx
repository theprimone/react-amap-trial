import React, { useState } from 'react';
import MarkerAMap from '../../../components/AMap/MarkerAMap';
import PolyEditor from '../../../components/AMap/components/PolyEditor';
import { Point, Polygon, pointInPolygon } from '../../../utils/pointInPolygon';
import { LngLat } from '../../../components/Props';
// import styles from './index.less';

export default function () {
  const [lng, setLng] = useState('');
  const [lat, setLat] = useState('');
  const [position, setPosition] = useState();
  const [polygonPath, setPolygonPath] = useState<LngLat[]>([]);
  const [inPolygon, setInPolygon] = useState<boolean>(false);

  const handleCheck = () => {
    if (!polygonPath.length) {
      console.warn('请选定多边形');
      return;
    }
    setPosition({ lng, lat });
    const polygon = new Polygon(polygonPath.map(item => new Point(item.lng, item.lat)));
    const target = new Point(Number(lng), Number(lat));
    setInPolygon(pointInPolygon(target, polygon))
    console.log(pointInPolygon(target, polygon));
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <span>
          lng: <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCheck();
              }
            }}
          />
        </span>
        <span style={{ marginLeft: 8 }}>
          lat: <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCheck();
              }
            }}
          />
        </span>
        {!!polygonPath.length && `多边形顶点数：${polygonPath.length} ，当前坐标在多边形中？`}
        {!!polygonPath.length && (inPolygon ? <span style={{ color: 'green' }}>Yes</span> : <span style={{ color: 'red' }}>No</span>)}
      </div>
      <p style={{ margin: 0 }}>
        多边形不可编辑则为选定，经纬度输入框回车即可验证
      </p>
      <div style={{ height: 'calc(100vh - 108px)' }}>
        <MarkerAMap
          position={position}
          onClick={(lnglat: LngLat) => {
            setPosition({ lng: lnglat.lng, lat: lnglat.lat })
          }}
          zoom={3}
          center={position}
        >
          <PolyEditor
            onSubmit={path => {
              console.log('new path', path);
              setPolygonPath([...path])
            }}
          />
        </MarkerAMap>
      </div>
    </div>
  )
}
