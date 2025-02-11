export interface Route {
  id?: string;
  route: string;
  distance: number;
}

export interface BusinessTrip {
  date?: Date;
  route?: string;
  distance?: number;
}
