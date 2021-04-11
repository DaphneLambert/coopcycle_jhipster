import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICourse, Course } from '../course.model';
import { CourseService } from '../service/course.service';
import { IPanier } from 'app/entities/panier/panier.model';
import { PanierService } from 'app/entities/panier/service/panier.service';
import { ICompte } from 'app/entities/compte/compte.model';
import { CompteService } from 'app/entities/compte/service/compte.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
})
export class CourseUpdateComponent implements OnInit {
  isSaving = false;

  ordersCollection: IPanier[] = [];
  comptesSharedCollection: ICompte[] = [];
  restaurantsSharedCollection: IRestaurant[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required, Validators.maxLength(16)]],
    timeRequired: [null, [Validators.required]],
    order: [],
    agents: [],
    restaurant: [],
  });

  constructor(
    protected courseService: CourseService,
    protected panierService: PanierService,
    protected compteService: CompteService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.updateForm(course);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const course = this.createFromForm();
    if (course.id !== undefined) {
      this.subscribeToSaveResponse(this.courseService.update(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(course));
    }
  }

  trackPanierById(index: number, item: IPanier): string {
    return item.id!;
  }

  trackCompteById(index: number, item: ICompte): string {
    return item.id!;
  }

  trackRestaurantById(index: number, item: IRestaurant): string {
    return item.id!;
  }

  getSelectedCompte(option: ICompte, selectedVals?: ICompte[]): ICompte {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(course: ICourse): void {
    this.editForm.patchValue({
      id: course.id,
      timeRequired: course.timeRequired,
      order: course.order,
      agents: course.agents,
      restaurant: course.restaurant,
    });

    this.ordersCollection = this.panierService.addPanierToCollectionIfMissing(this.ordersCollection, course.order);
    this.comptesSharedCollection = this.compteService.addCompteToCollectionIfMissing(
      this.comptesSharedCollection,
      ...(course.agents ?? [])
    );
    this.restaurantsSharedCollection = this.restaurantService.addRestaurantToCollectionIfMissing(
      this.restaurantsSharedCollection,
      course.restaurant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.panierService
      .query({ filter: 'course-is-null' })
      .pipe(map((res: HttpResponse<IPanier[]>) => res.body ?? []))
      .pipe(map((paniers: IPanier[]) => this.panierService.addPanierToCollectionIfMissing(paniers, this.editForm.get('order')!.value)))
      .subscribe((paniers: IPanier[]) => (this.ordersCollection = paniers));

    this.compteService
      .query()
      .pipe(map((res: HttpResponse<ICompte[]>) => res.body ?? []))
      .pipe(
        map((comptes: ICompte[]) =>
          this.compteService.addCompteToCollectionIfMissing(comptes, ...(this.editForm.get('agents')!.value ?? []))
        )
      )
      .subscribe((comptes: ICompte[]) => (this.comptesSharedCollection = comptes));

    this.restaurantService
      .query()
      .pipe(map((res: HttpResponse<IRestaurant[]>) => res.body ?? []))
      .pipe(
        map((restaurants: IRestaurant[]) =>
          this.restaurantService.addRestaurantToCollectionIfMissing(restaurants, this.editForm.get('restaurant')!.value)
        )
      )
      .subscribe((restaurants: IRestaurant[]) => (this.restaurantsSharedCollection = restaurants));
  }

  protected createFromForm(): ICourse {
    return {
      ...new Course(),
      id: this.editForm.get(['id'])!.value,
      timeRequired: this.editForm.get(['timeRequired'])!.value,
      order: this.editForm.get(['order'])!.value,
      agents: this.editForm.get(['agents'])!.value,
      restaurant: this.editForm.get(['restaurant'])!.value,
    };
  }
}
