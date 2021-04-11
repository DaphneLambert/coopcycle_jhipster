import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { ICompte } from 'app/entities/compte/compte.model';

export interface ICooperative {
  id?: string;
  name?: string;
  possessions?: IRestaurant[] | null;
  members?: ICompte[] | null;
}

export class Cooperative implements ICooperative {
  constructor(public id?: string, public name?: string, public possessions?: IRestaurant[] | null, public members?: ICompte[] | null) {}
}

export function getCooperativeIdentifier(cooperative: ICooperative): string | undefined {
  return cooperative.id;
}
