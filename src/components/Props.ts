export interface LngLat {
  lng: number;
  lat: number;
  noAutofix?: boolean;
}

export interface Poi {
  adcode: string;
  address: string;
  city: [];
  district: string;
  id: string;
  location: {
    P: number,
    Q: number,
  } & LngLat | '';
  name: string;
  typecode: string;
}
