import { ICompte } from 'app/entities/compte/compte.model';
import { IProduit } from 'app/entities/produit/produit.model';
import { ICourse } from 'app/entities/course/course.model';
import { IPanier } from 'app/entities/panier/panier.model';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';

export interface IRestaurant {
  id?: string;
  name?: string;
  adress?: string;
  owned?: ICompte | null;
  products?: IProduit[] | null;
  orders?: ICourse[] | null;
  carts?: IPanier[] | null;
  cooperative?: ICooperative | null;
}

export class Restaurant implements IRestaurant {
  constructor(
    public id?: string,
    public name?: string,
    public adress?: string,
    public owned?: ICompte | null,
    public products?: IProduit[] | null,
    public orders?: ICourse[] | null,
    public carts?: IPanier[] | null,
    public cooperative?: ICooperative | null
  ) {}
}

export function getRestaurantIdentifier(restaurant: IRestaurant): string | undefined {
  return restaurant.id;
}
