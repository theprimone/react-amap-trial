import React, { useState } from 'react';
import PickerAmap from '../../../components/AMap/PickerAmap';
import { LngLat } from '../../../components/Props';
// import styles from './index.less';

export default function () {
  const [position, setPosition] = useState();
  const [formattedAddress, setFormattedAddress] = useState();
  return (
    <PickerAmap
      formattedAddress={formattedAddress}
      wrapperStyle={{ height: 'calc(100vh - 8px)' }}
      position={position}
      onClick={(lnglat: LngLat) => setPosition({ lng: lnglat.lng, lat: lnglat.lat })}
      getFormattedAddress={(address) => {
        setFormattedAddress(address);
      }}
    />
  )
}
