import { Component, inject } from '@angular/core';
import { RecipeService } from '../shared/services/recipe.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private recipeService = inject(RecipeService);

  recipes = this.recipeService.getRecipes();
}
