import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { CategoryDto } from '../model/Dto';
import { CATEGORY } from '../helper/Constants';
import { CategoryViewModel } from '../model/ViewModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryService {

  constructor(private dbService: DatabaseService) { }
  
  async insert(category: CategoryDto){
    try{
      const insertQuery = `INSERT INTO ${CATEGORY.TABLE} (${CATEGORY.COLUMNS.NAME}) VALUES ('${category.name}')`;
      await this.dbService.executeQuery(insertQuery);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async update(category: CategoryDto){
    try{
      const insertQuery = `UPDATE ${CATEGORY.TABLE} SET ${CATEGORY.COLUMNS.NAME} =  '${category.name}'`;
      await this.dbService.executeQuery(insertQuery);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async delete(id: number){
    try{
      const query = `UPDATE ${CATEGORY.TABLE} SET ${CATEGORY.COLUMNS.DELETED_AT} = (DATETIME('now','localtime')) WHERE ${CATEGORY.COLUMNS.ID} = ${id}`;
      await this.dbService.executeQuery(query);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async find(id: number): Promise<CategoryViewModel | null>{
    try{
      const query = `SELECT c.id, c.name FROM ${CATEGORY.TABLE} c 
       WHERE c.${CATEGORY.COLUMNS.ID} = ${id} AND c.${CATEGORY.COLUMNS.DELETED_AT} IS NULL`;
      return await this.dbService.queryOne<CategoryViewModel>(query);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async findAll():Promise<CategoryViewModel[]>{
    try{
      const query = `SELECT c.id, c.name FROM ${CATEGORY.TABLE} c 
       WHERE c.${CATEGORY.COLUMNS.DELETED_AT} IS NULL`;
      return await this.dbService.query<CategoryViewModel>(query);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }
}
