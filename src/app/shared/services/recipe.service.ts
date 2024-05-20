import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { RecipeInterface } from '../recipes/recipe.interface';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private databaseService = inject(DatabaseService);
  private authService = inject(AuthService);

  getRecipes(): Observable<RecipeInterface[]> {
    let observer = new Observable<RecipeInterface[]>();
    this.authService.$user.subscribe((user) => {
      const promise = this.databaseService.read(`recipes/${user?.uid}`);

      observer = new Observable((observer) => {
        promise.then((recipes) => {
          observer.next(recipes.val());
        });
      });
    });

    return observer;
  }

  getRecipe(id: string): Observable<RecipeInterface> {
    let observer = new Observable<RecipeInterface>();
    this.authService.$user.subscribe((user) => {
      const promise = this.databaseService.read(
        `recipes/${user?.uid}/${id}`
      );

      observer = new Observable((observer) => {
        promise.then((recipe) => {
          observer.next(recipe.val());
        });
      });
    });

    return observer;
  }

  createRecipe(recipe: RecipeInterface) {
    this.authService.$user.subscribe((user) => {
      recipe.id = `${user?.uid}/${this.generateUUID()}`;
      this.databaseService.write('recipes', recipe);
    });
  }

  updateRecipe(recipe: RecipeInterface) {
    this.databaseService.write(`recipes/${recipe.id}`, recipe);
  }

  deleteRecipe(id: string) {
    this.databaseService.write(`recipes/${id}`, null);
  }

  // todo move to a helper class
  private generateUUID(): string {
    let d = new Date().getTime();
    let d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }
}
