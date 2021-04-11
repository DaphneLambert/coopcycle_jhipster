import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISystemePaiement, getSystemePaiementIdentifier } from '../systeme-paiement.model';

export type EntityResponseType = HttpResponse<ISystemePaiement>;
export type EntityArrayResponseType = HttpResponse<ISystemePaiement[]>;

@Injectable({ providedIn: 'root' })
export class SystemePaiementService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/systeme-paiements');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(systemePaiement: ISystemePaiement): Observable<EntityResponseType> {
    return this.http.post<ISystemePaiement>(this.resourceUrl, systemePaiement, { observe: 'response' });
  }

  update(systemePaiement: ISystemePaiement): Observable<EntityResponseType> {
    return this.http.put<ISystemePaiement>(
      `${this.resourceUrl}/${getSystemePaiementIdentifier(systemePaiement) as number}`,
      systemePaiement,
      { observe: 'response' }
    );
  }

  partialUpdate(systemePaiement: ISystemePaiement): Observable<EntityResponseType> {
    return this.http.patch<ISystemePaiement>(
      `${this.resourceUrl}/${getSystemePaiementIdentifier(systemePaiement) as number}`,
      systemePaiement,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISystemePaiement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISystemePaiement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSystemePaiementToCollectionIfMissing(
    systemePaiementCollection: ISystemePaiement[],
    ...systemePaiementsToCheck: (ISystemePaiement | null | undefined)[]
  ): ISystemePaiement[] {
    const systemePaiements: ISystemePaiement[] = systemePaiementsToCheck.filter(isPresent);
    if (systemePaiements.length > 0) {
      const systemePaiementCollectionIdentifiers = systemePaiementCollection.map(
        systemePaiementItem => getSystemePaiementIdentifier(systemePaiementItem)!
      );
      const systemePaiementsToAdd = systemePaiements.filter(systemePaiementItem => {
        const systemePaiementIdentifier = getSystemePaiementIdentifier(systemePaiementItem);
        if (systemePaiementIdentifier == null || systemePaiementCollectionIdentifiers.includes(systemePaiementIdentifier)) {
          return false;
        }
        systemePaiementCollectionIdentifiers.push(systemePaiementIdentifier);
        return true;
      });
      return [...systemePaiementsToAdd, ...systemePaiementCollection];
    }
    return systemePaiementCollection;
  }
}
