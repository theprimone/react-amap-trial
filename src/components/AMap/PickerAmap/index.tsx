import React, { useState } from "react";
import Geolocation from "react-amap-plugin-custom-geolocation";
import MarkerAMap, { MarkerAMapProps } from '../MarkerAMap';
import PlaceSearch from '../components/PlaceSearch'
import CurrentAddress from "./CurrentAddress";
import { LngLat } from "../../props";

let geocoder = null;
const titleHeight = 37;

export const geoCode = (address, callback) => {
  if (geocoder) {
    (geocoder as any).getLocation(address, callback);
  }
  // geocoder.getLocation(address, (status, result) => {
  //   console.log(address);
  //   console.log(status);
  //   console.log(result);
  //   if (status === 'complete' && result.geocodes.length) {
  //     return result.geocodes[0];
  //   }
  //   console.error('根据地址查询位置失败');
  //   return {};
  // });
};

function isLocationPosition(locationPosition: LngLat, position: LngLat) {
  const {
    lng: locationLng,
    lat: locationLat,
  } = locationPosition || {};
  const { lng, lat } = position || {};
  return locationLng === lng && locationLat === lat;
}

export type ErrorType = 'locationError' | 'getFormattedAddress';

export interface AddressInfo {
  lat: number;
  lng: number;
  adcode: string;
  district: string;
  city?: string;
  citycode?: string;
  province?: string;
  street?: string;
  streetNumber?: string;
  township?: string;
}

export interface PickerAMapProps extends MarkerAMapProps {
  formattedAddress?: string;
  /** AMap wrapper style */
  wrapperStyle?: React.CSSProperties;
  onClick?: (lnglat: LngLat) => void;
  /** get human-readable address */
  getFormattedAddress?: (formattedAddress: string | null, info?: AddressInfo) => void;
  onCreated?: (map: any) => void;
  onError?: (type: ErrorType, value: any) => void;
}

export const PickerAmap: React.FC<PickerAMapProps> = ({
  position,
  formattedAddress,
  wrapperStyle = {},
  onClick = () => { },
  getFormattedAddress = () => { },
  onCreated = () => { },
  children,
  onError = () => { },
  ...rest
}) => {
  const [locationPosition, setLocationPosition] = useState<LngLat>({} as LngLat);

  const handleCreatedMap = map => {
    onCreated(map);
    if (!geocoder) {
      geocoder = new window.AMap.Geocoder({
        // city: '010', // 城市设为北京，默认：“全国”
        radius: 1000 // 范围，默认：500
      });
    }
  };

  const regeoCode = (lnglat: LngLat) => {
    if (geocoder) {
      (geocoder as any).getAddress([lnglat.lng, lnglat.lat], (status, result) => {
        console.log(status, result);
        if (status === 'complete') {
          const { regeocode: { addressComponent, formattedAddress: resultAddress } } = result;
          getFormattedAddress(resultAddress, {
            lnglat,
            ...addressComponent,
          });
        } else {
          onError('getFormattedAddress', { status, result });
          console.error('getFormattedAddress:', status, result);
          getFormattedAddress(null);
        }
      });
    }
  };

  const { height } = wrapperStyle;

  return (
    <CurrentAddress formattedAddress={formattedAddress}>
      <div style={{ ...wrapperStyle, height: `calc(${height} - ${titleHeight}px)` }}>
        <MarkerAMap
          position={position}
          displayMarker={!isLocationPosition(locationPosition, position)}
          onCreated={handleCreatedMap}
          onClick={(lnglat: LngLat) => {
            regeoCode(lnglat);
            onClick(lnglat);
          }}
          {...rest}
        >
          <Geolocation
            enableHighAccuracy
            timeout={5000}
            buttonPosition="RB"
            events={{
              created: o => {
                window.AMap.event.addListener(o, "complete", result => {
                  const { addressComponent, formattedAddress, position } = result;
                  console.log(position);
                  setLocationPosition({
                    lng: result.position.lng,
                    lat: result.position.lat,
                  });
                  onClick(position);
                  getFormattedAddress(formattedAddress, {
                    lat: position.lat,
                    lng: position.lng,
                    ...addressComponent
                  });
                }); // 返回定位信息
                window.AMap.event.addListener(
                  o,
                  "error",
                  ({ info, message: msg }) => {
                    onError('locationError', { info, message: msg });
                    console.error("location error, info:", info, ", message:", msg);
                  }
                ); // 返回定位出错信息
              }
            }}
          />
          <PlaceSearch
            onPlaceSelect={poi => {
              console.log("PlaceSearch poi", poi);
              const { location } = poi;
              if (location) {
                console.log(location);
                onClick(location);
                const address = `${poi.district}${poi.address}${poi.name}`
                getFormattedAddress(address, {
                  lat: location.lat,
                  lng: location.lng,
                  adcode: poi.adcode,
                  district: poi.district,
                });
              }
            }}
          />
          {children}
        </MarkerAMap>
      </div>
    </CurrentAddress>
  );
}

export default PickerAmap;
