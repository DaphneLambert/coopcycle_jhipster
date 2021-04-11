import { IProduit } from 'app/entities/produit/produit.model';
import { ICompte } from 'app/entities/compte/compte.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';

export interface IPanier {
  id?: string;
  nbElements?: number;
  price?: number;
  contents?: IProduit[] | null;
  compte?: ICompte | null;
  restaurant?: IRestaurant | null;
}

export class Panier implements IPanier {
  constructor(
    public id?: string,
    public nbElements?: number,
    public price?: number,
    public contents?: IProduit[] | null,
    public compte?: ICompte | null,
    public restaurant?: IRestaurant | null
  ) {}
}

export function getPanierIdentifier(panier: IPanier): string | undefined {
  return panier.id;
}
