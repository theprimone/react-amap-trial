import React from 'react';
import BasicAMap from '../src/Page/0-AMap/0-BasicAMap';
import MarkerAMap from '../src/Page/0-AMap/1-MarkerAMap';
import PickerAmap from '../src/Page/0-AMap/2-PickerAmap';

export default {
  title: 'AMap',
};

export const basicAMap = () => <BasicAMap />;
basicAMap.story = {
  name: 'Basic AMap',
}

export const markerAMap = () => <MarkerAMap />;
markerAMap.story = {
  name: 'Marker AMap',
}

export const pickerAmap = () => <PickerAmap />;
pickerAmap.story = {
  name: 'Picker AMap',
}
