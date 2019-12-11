import React from "react";
import { Marker } from "react-amap";
import BasicAMap, { BasicAMapProps } from './BasicAMap';
import { LngLat } from "../props";

export interface MarkerAMapProps extends BasicAMapProps {
  /** position of Marker */
  position: LngLat;
  displayMarker?: boolean;
}

export const MarkerAMap: React.FC<MarkerAMapProps> = ({
  position,
  displayMarker = true,
  children,
  ...rest
}) => {
  const isValidPosition = position && position.lng && position.lat;
  const setCenter = () => {
    return isValidPosition ? position : undefined;
  }

  return (
    <BasicAMap
      version="1.4.14&plugin=AMap.Geocoder,AMap.Autocomplete,AMap.PlaceSearch"
      center={setCenter()}
      {...rest}
    >
      {isValidPosition && displayMarker && <Marker position={{ longitude: position.lng, latitude: position.lat }} />}
      {children}
    </BasicAMap>
  );
}

export default MarkerAMap;
