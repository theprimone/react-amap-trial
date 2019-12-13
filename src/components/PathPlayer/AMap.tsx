import React, { useState } from 'react';
import BasicAMap from '../../components/AMap/BasicAMap';
import { LngLat } from '../props';
import { injectChildren } from '../../utils';
import styles from './AMap.less';

export interface PathMapProps {
  panelWidth?: React.CSSProperties['width'];
  height: React.CSSProperties['height'];
}
export default function ({ panelWidth, height, children }: React.PropsWithChildren<PathMapProps>) {
  const [position, setPosition] = useState();
  const [amapIns, setAmapIns] = useState();
  const [amapUILoading, setAmapUILoading] = useState<boolean>(true);

  const initCallback = (AMapUI) => {
    console.log("AMapUI Loaded Done.")
    console.log(AMapUI);
    setAmapUILoading(false);
  }

  const panelProps = !!panelWidth && {
    className: styles.panel,
    style: {
      width: panelWidth,
      height,
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height, paddingRight: panelWidth }}>
        <BasicAMap
          onClick={(lnglat: LngLat) => setPosition({ lng: lnglat.lng, lat: lnglat.lat })}
          onCreated={(amap) => { setAmapIns(amap) }}
          zoom={4}
          center={position}
          useAMapUI={initCallback}
        />
      </div>
      <div {...panelProps}>
        {!amapUILoading && amapIns && injectChildren(children, { __map__: amapIns })}
      </div>
    </div>
  )
}
