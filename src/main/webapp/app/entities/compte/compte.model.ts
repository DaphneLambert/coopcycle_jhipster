import { IPanier } from 'app/entities/panier/panier.model';
import { IRoles } from 'app/entities/roles/roles.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { ISystemePaiement } from 'app/entities/systeme-paiement/systeme-paiement.model';
import { ICourse } from 'app/entities/course/course.model';

export interface ICompte {
  id?: string;
  name?: string;
  surname?: string;
  age?: number | null;
  adress?: string;
  carts?: IPanier[] | null;
  roles?: IRoles | null;
  owns?: IRestaurant | null;
  cooperative?: ICooperative | null;
  operations?: ISystemePaiement[] | null;
  courses?: ICourse[] | null;
}

export class Compte implements ICompte {
  constructor(
    public id?: string,
    public name?: string,
    public surname?: string,
    public age?: number | null,
    public adress?: string,
    public carts?: IPanier[] | null,
    public roles?: IRoles | null,
    public owns?: IRestaurant | null,
    public cooperative?: ICooperative | null,
    public operations?: ISystemePaiement[] | null,
    public courses?: ICourse[] | null
  ) {}
}

export function getCompteIdentifier(compte: ICompte): string | undefined {
  return compte.id;
}
