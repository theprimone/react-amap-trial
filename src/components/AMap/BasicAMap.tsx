import React from "react";
import { Map, MapProps } from "react-amap";
import { mapConfig } from '../../config';
import { LngLat } from "../Props";

const defaultPlugins = ["Scale"];

export interface BasicAMapProps extends MapProps {
  onClick?: (lnglat: LngLat) => void;
  onCreated?: (amap: any) => void;
}

export const BasicAMap: React.FC<BasicAMapProps> = ({
  onClick = () => { },
  onCreated = () => { },
  ...rest
}) => {

  return (
    <Map
      amapkey={mapConfig.amapKey}
      plugins={defaultPlugins as any}
      events={{
        created: onCreated,
        click: (event) => {
          const { lnglat } = event;
          onClick(lnglat);
        }
      }}
      loading={
        <span
          style={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          加载中...
        </span>
      }
      {...rest}
    />
  );
}

export default BasicAMap;
