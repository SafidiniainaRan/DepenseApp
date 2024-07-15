import { Injectable } from '@angular/core';
import { CategoryViewModel } from '../model/ViewModel';
import { CategoryDto } from '../model/Dto';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CategoryMapperService {

  constructor() { }

  mapCategoryViewModelToCategoryDto(category: CategoryViewModel): CategoryDto{
    const categoryDto = {
      id: category.id,
      name: category.name
    }
    return categoryDto;
  }

  mapFbToCategoryDto(categoryForm: FormGroup): CategoryDto {
    let categoryDto= {
      id : undefined,
      name: categoryForm.get('name')?.value
    }
    if(categoryForm.get('id') && categoryForm.get('id')?.value) categoryDto.id = categoryForm.get('id')?.value;
    return categoryDto;
  }
}
