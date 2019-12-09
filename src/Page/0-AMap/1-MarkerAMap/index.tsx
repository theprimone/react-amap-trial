import React, { useState } from "react";
import MarkerAMap from '../../../components/AMap/MarkerAMap';
import { LngLat } from "../../../components/Props";
import Container from '../../components/Container';

export default () => {
  const [position, setPosition] = useState<LngLat>({} as LngLat);

  return (
    <Container>
      <MarkerAMap
        position={position}
        onClick={(lnglat) => {
          setPosition(lnglat);
        }}
      />
    </Container>
  );
}
