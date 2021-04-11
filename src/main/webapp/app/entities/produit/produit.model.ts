import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { IPanier } from 'app/entities/panier/panier.model';

export interface IProduit {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
  restaurant?: IRestaurant | null;
  carts?: IPanier[] | null;
}

export class Produit implements IProduit {
  constructor(
    public id?: string,
    public name?: string,
    public price?: number,
    public quantity?: number,
    public restaurant?: IRestaurant | null,
    public carts?: IPanier[] | null
  ) {}
}

export function getProduitIdentifier(produit: IProduit): string | undefined {
  return produit.id;
}
