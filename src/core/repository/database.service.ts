import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { CATEGORY, SPEND, SPEND_DB, USER } from '../helper/Constants';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() { 
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }
  async openConnection(){
    if(this.db){
      return;
    }
    try{
      this.db = await this.sqlite.createConnection(
        SPEND_DB,
        false,
        'no-encryption',
        1,
        false
      );
      await this.db.open();
    }
    catch(error){
      console.log('try to reload db connection '+this.db?.getConnectionDBName());
      console.log(error);
      this.openConnection();
      throw error;
    }
  }

  async initializeDatabase(){
    try {
      await this.openConnection();
      if(!this.db) throw new Error('Database connection is not open');
      
      const enableFK = 'PRAGMA foreign_keys = ON';
      await this.db.execute(enableFK);

      const userSchema = ` CREATE TABLE IF NOT EXISTS ${USER.TABLE}(
        ${USER.COLUMNS.ID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${USER.COLUMNS.FIRST_NAME} TEXT NOT NULL,
        ${USER.COLUMNS.LAST_NAME} TEXT NOT NULL,
        ${USER.COLUMNS.CREATED_AT} DATETIME DEFAULT (DATETIME('now','localtime')),
        ${USER.COLUMNS.DELETED_AT} DATETIME NULL
      )`;
      await this.db.execute(userSchema);

      const categorySchema = ` CREATE TABLE IF NOT EXISTS ${CATEGORY.TABLE}(
        ${CATEGORY.COLUMNS.ID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${CATEGORY.COLUMNS.NAME} TEXT NOT NULL,
        ${CATEGORY.COLUMNS.CREATED_AT} DATETIME DEFAULT (DATETIME('now','localtime')),
        ${CATEGORY.COLUMNS.DELETED_AT} DATETIME NULL
      )`;
      await this.db.execute(categorySchema);

      const spendSchema = ` CREATE TABLE IF NOT EXISTS ${SPEND.TABLE}(
        ${SPEND.COLUMNS.ID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${SPEND.COLUMNS.ID_CATEGORY} INTEGER NOT NULL,
        ${SPEND.COLUMNS.AMOUNT} INTEGER NOT NULL,
        ${SPEND.COLUMNS.DESCRIPTION} TEXT NULL,
        ${SPEND.COLUMNS.DATE} DATE NOT NULL,
        ${SPEND.COLUMNS.CREATED_AT} DATETIME DEFAULT (DATETIME('now','localtime')),
        ${SPEND.COLUMNS.DELETED_AT} DATETIME NULL,
        FOREIGN KEY(${SPEND.COLUMNS.ID_CATEGORY}) REFERENCES ${CATEGORY.TABLE}(${CATEGORY.COLUMNS.ID})
      )`;
      await this.db.execute(spendSchema);
    } catch (error) {
      console.log(error);
      throw error;
    } finally{
      try {
        await this.closeConnection();
      } catch (error) {
        console.log(error);
      }
    }
  }

  async getDbInstance(): Promise<SQLiteDBConnection>{
    if(!this.db){
      await this.openConnection();
    }
    return this.db!;
  }

  async closeConnection(){
    // await this.sqlite.closeConnection(SPEND_DB, false);
    // this.db= null;
  }

  async executeQuery(query: string){
    try {
      await this.openConnection();
      if(!this.db) throw new Error('Database connection is not open');
      console.log(query);
      await this.db.execute(query);
    } catch (error) {
      console.log(error);
      throw error;
    }finally{
      try {
        await this.closeConnection();
      } catch (error) {
        console.log(error);
      }
    }
  }

  async query<T>(query: string, mapper ?: (a: any) => T ): Promise<T[]>{
    try {
      await this.openConnection();
      if(!this.db) throw new Error('Database connection is not open');
      console.log(query);
      const result = await this.db.query(query);
      if(mapper){
        return (result.values || []).map(mapper) ;
      }
      return (result.values || []) as T[];
    } catch (error) {
      console.log(error);
      throw error;
    }finally{
      try {
        await this.closeConnection();
      } catch (error) {
        console.log(error);
      }
    }
  }
  async queryOne<T>(query: string, mapper ?: (a: any) => T ): Promise<T | null>{
    try{
      const results = await this.query(query, mapper);
      return results.length > 0 ? results[0] : null;
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }
}
