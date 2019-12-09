import React, { useState } from "react";
import BasicAMap from '../../../components/AMap/BasicAMap';
import { LngLat } from "../../../components/Props";
import Container from '../../components/Container';

export default () => {
  return (
    <Container>
      <BasicAMap />
    </Container>
  );
}
