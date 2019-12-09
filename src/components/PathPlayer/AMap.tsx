import React, { useState } from 'react';
import BasicAMap from '../../components/AMap/BasicAMap';
import { LngLat } from '../Props';
// import styles from './index.less';

export default function ({ height, children }) {
  const [position, setPosition] = useState();

  const initCallback = () => {
    console.log("AMapUI Loaded Done.")
  }

  return (
    <div style={{ height, position: 'relative' }}>
      <BasicAMap
        onClick={(lnglat: LngLat) => setPosition({ lng: lnglat.lng, lat: lnglat.lat })}
        onCreated={(amap) => { amap = amap }}
        zoom={4}
        center={position}
        useAMapUI={initCallback}
      >
        {children}
      </BasicAMap>
    </div>
  )
}
