export interface ILocation {
  lat: number,
  lng: number,
}

export interface IPoint extends ILocation{
  number: number,
  height: number
}
