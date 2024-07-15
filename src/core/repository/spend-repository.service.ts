import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { CATEGORY, SPEND } from '../helper/Constants';
import { SpendDto } from '../model/Dto';
import { DateHelperService } from '../helper/date-helper.service';
import { SpendMonthlyGroupViewModel, SpendMonthlyViewModel, SpendViewModel } from '../model/ViewModel';
import { SpendMapperService } from '../mapper/spend-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class SpendRepositoryService {

  constructor(private dbService: DatabaseService, private spendMap: SpendMapperService) { }

  async insert(spend: SpendDto){
    try{
      const insertQuery = `INSERT INTO ${SPEND.TABLE} (${SPEND.COLUMNS.ID_CATEGORY}, ${SPEND.COLUMNS.AMOUNT}, ${SPEND.COLUMNS.DESCRIPTION}, ${SPEND.COLUMNS.DATE}) VALUES (${spend.idCategory}, ${spend.amount}, '${spend.description}', '${DateHelperService.toStringDbFormat(spend.date)}')`;
      await this.dbService.executeQuery(insertQuery);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async update(spend: SpendDto){
    try{
      const insertQuery = `UPDATE ${SPEND.TABLE} SET ${SPEND.COLUMNS.AMOUNT} =  ${spend.amount}, ${SPEND.COLUMNS.DESCRIPTION} = '${spend.description}' , ${SPEND.COLUMNS.DATE} = '${DateHelperService.toStringDbFormat(spend.date)}', ${SPEND.COLUMNS.ID_CATEGORY} = ${spend.idCategory} WHERE ${SPEND.COLUMNS.ID} = ${spend.id ?? 0}`;
      await this.dbService.executeQuery(insertQuery);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async delete(id: number){
    try{
      const query = `UPDATE ${SPEND.TABLE} SET ${SPEND.COLUMNS.DELETED_AT} = (DATETIME('now','localtime')) WHERE ${SPEND.COLUMNS.ID} = ${id}`;
      await this.dbService.executeQuery(query);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async find(id: number): Promise<SpendViewModel | null>{
    try{
      const query = `SELECT sp.${SPEND.COLUMNS.ID}, sp.${SPEND.COLUMNS.ID_CATEGORY}, c.${CATEGORY.COLUMNS.NAME} as category, sp.${SPEND.COLUMNS.DATE}, sp.${SPEND.COLUMNS.AMOUNT}, sp.${SPEND.COLUMNS.DESCRIPTION}  FROM ${SPEND.TABLE} sp 
       JOIN ${CATEGORY.TABLE} c ON sp.${SPEND.COLUMNS.ID_CATEGORY} = c.${CATEGORY.COLUMNS.ID} 
       WHERE sp.${SPEND.COLUMNS.ID} = ${id} AND sp.${SPEND.COLUMNS.DELETED_AT} IS NULL`;
      return await this.dbService.queryOne<SpendViewModel>(query, this.spendMap.mapToSpendViewModel);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async findAll():Promise<SpendViewModel[]>{
    try{
      const query = `SELECT sp.${SPEND.COLUMNS.ID}, sp.${SPEND.COLUMNS.ID_CATEGORY}, c.${CATEGORY.COLUMNS.NAME} as category, sp.${SPEND.COLUMNS.DATE}, sp.${SPEND.COLUMNS.AMOUNT}, sp.${SPEND.COLUMNS.DESCRIPTION}  FROM ${SPEND.TABLE} sp 
       JOIN ${CATEGORY.TABLE} c ON sp.${SPEND.COLUMNS.ID_CATEGORY} = c.${CATEGORY.COLUMNS.ID} 
       WHERE sp.${SPEND.COLUMNS.DELETED_AT} IS NULL 
       ORDER BY sp.${SPEND.COLUMNS.DATE}`;
      return await this.dbService.query<SpendViewModel>(query, this.spendMap.mapToSpendViewModel);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async findAllByMonthYear(month: number, year: number):Promise<SpendViewModel[]>{
    try{
      const query = `SELECT sp.${SPEND.COLUMNS.ID}, sp.${SPEND.COLUMNS.ID_CATEGORY}, c.${CATEGORY.COLUMNS.NAME} as category, sp.${SPEND.COLUMNS.DATE}, sp.${SPEND.COLUMNS.AMOUNT}, sp.${SPEND.COLUMNS.DESCRIPTION}  FROM ${SPEND.TABLE} sp 
       JOIN ${CATEGORY.TABLE} c ON sp.${SPEND.COLUMNS.ID_CATEGORY} = c.${CATEGORY.COLUMNS.ID} 
       WHERE sp.${SPEND.COLUMNS.DELETED_AT} IS NULL AND strftime('%Y-%m', sp.${SPEND.COLUMNS.DATE}) = '${year}-${("0"+month).slice(-2)}' 
       ORDER BY sp.${SPEND.COLUMNS.DATE}`;
      return await this.dbService.query<SpendViewModel>(query, this.spendMap.mapToSpendViewModel);
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async getSpendMonthly(year: number) : Promise<SpendMonthlyViewModel[]>{
    try {
      const query = `SELECT month, ( 
       SELECT SUM(sp.${SPEND.COLUMNS.AMOUNT}) FROM ${SPEND.TABLE} sp 
       WHERE sp.${SPEND.COLUMNS.DELETED_AT} IS NULL AND strftime('%Y-%m', sp.${SPEND.COLUMNS.DATE}) = '${year}'||'-'||month 
       ) as amount 
       FROM ( 
       VALUES ('01'), ('02'), ('03'), ('04'), ('05'), ('06'), ('07'), ('08'), ('09'), ('10'), ('11'), ('12') 
      ) AS numbers(month))
      `;
      return await this.dbService.query<SpendMonthlyViewModel>(query);
    } 
    catch(error){
      console.log(error);
      throw error;
    }
  }

  async getSpendMonthlyGroup( month: number, year: number) : Promise<SpendMonthlyGroupViewModel[]>{
    try {
      const query = `SELECT SUM(sp.${SPEND.COLUMNS.AMOUNT}) as amount, c.${CATEGORY.COLUMNS.NAME} as category FROM ${SPEND.TABLE} sp 
       JOIN ${CATEGORY.TABLE} c ON sp.${SPEND.COLUMNS.ID_CATEGORY} = c.${CATEGORY.COLUMNS.ID} 
       WHERE sp.${SPEND.COLUMNS.DELETED_AT} IS NULL AND strftime('%Y-%m', sp.${SPEND.COLUMNS.DATE}) = '${year}-${('0'+month).slice(-2)}' 
       GROUP BY c.${CATEGORY.COLUMNS.NAME}
      `;
      return await this.dbService.query<SpendMonthlyGroupViewModel>(query);
    } 
    catch(error){
      console.log(error);
      throw error;
    }
  }
  
}
