import { ICompte } from 'app/entities/compte/compte.model';

export interface ISystemePaiement {
  id?: number;
  method?: string;
  agents?: ICompte[] | null;
}

export class SystemePaiement implements ISystemePaiement {
  constructor(public id?: number, public method?: string, public agents?: ICompte[] | null) {}
}

export function getSystemePaiementIdentifier(systemePaiement: ISystemePaiement): number | undefined {
  return systemePaiement.id;
}
