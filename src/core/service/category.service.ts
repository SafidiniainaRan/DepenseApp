import { Injectable } from '@angular/core';
import { CategoryRepositoryService } from '../repository/category-repository.service';
import { CategoryViewModel } from '../model/ViewModel';
import { CategoryDto } from '../model/Dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private categoryRepo: CategoryRepositoryService) { }

  async findAll(): Promise<CategoryViewModel[]>{
    return await this.categoryRepo.findAll()
  }
  async find(id: number): Promise<CategoryViewModel | null>{
    return await this.categoryRepo.find(id);
  }
  async delete(id: number){
    await this.categoryRepo.delete(id);
  }
  async update(category: CategoryDto){
    await this.categoryRepo.update(category);
  }
  async create(category: CategoryDto){
    await this.categoryRepo.insert(category);
  }
}
