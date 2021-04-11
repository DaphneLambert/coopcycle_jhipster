import { IPanier } from 'app/entities/panier/panier.model';
import { ICompte } from 'app/entities/compte/compte.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';

export interface ICourse {
  id?: string;
  timeRequired?: number;
  order?: IPanier | null;
  agents?: ICompte[] | null;
  restaurant?: IRestaurant | null;
}

export class Course implements ICourse {
  constructor(
    public id?: string,
    public timeRequired?: number,
    public order?: IPanier | null,
    public agents?: ICompte[] | null,
    public restaurant?: IRestaurant | null
  ) {}
}

export function getCourseIdentifier(course: ICourse): string | undefined {
  return course.id;
}
