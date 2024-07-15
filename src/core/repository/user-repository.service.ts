import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { UserViewModel } from '../model/ViewModel';
import { SPEND_DB, USER } from '../helper/Constants';
import { UserDto } from '../model/Dto';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  constructor() { }
  
  async initializePlugin(){
    this.db = await this.sqlite.createConnection(
      'userDb',
      false,
      'no-encryption',
      1,
      false
    );
    await this.db.open();
    const schema = ` CREATE TABLE IF NOT EXISTS ${USER.TABLE}(
      ${USER.COLUMNS.ID} INTEGER PRIMARY KEY AUTOINCREMENT,
      ${USER.COLUMNS.FIRST_NAME} TEXT NOT NULL,
      ${USER.COLUMNS.LAST_NAME} TEXT NOT NULL,
      ${USER.COLUMNS.CREATED_AT} DATETIME DEFAULT (DATETIME('now','localtime')),
      ${USER.COLUMNS.DELETED_AT} DATETIME NULL
    )`;
    await this.db.execute(schema);
  }

  async insert(user: UserDto){
    try {
      const res = await this.db.execute(`INSERT INTO ${USER.TABLE}(${USER.COLUMNS.FIRST_NAME}, ${USER.COLUMNS.LAST_NAME}) VALUES('${user.firstName}', '${user.lastName}')`)
      console.log(res);
    } 
    catch (error) {
      throw error;
    }
  }
  async findAll(): Promise<UserViewModel[]>{
    let users: UserViewModel[] = [];
    try{
      const results = await this.db.query(`SELECT ${USER.COLUMNS.ID}, ${USER.COLUMNS.FIRST_NAME}, ${USER.COLUMNS.LAST_NAME} FROM ${USER.TABLE} WHERE ${USER.COLUMNS.DELETED_AT} IS NULL`);
      console.log(results);
      users = (results.values || []).map(x => {
        const u = {
          id: x.id,
          firstName: x.first_name,
          lastName: x.last_Name
        };
        return u;
      });
    }
    catch (error) {
      throw error;
    }
    console.log(users);

    return users;
  }
  async delete(id: number){
    try {
      await this.db.execute(`UPDATE ${USER.TABLE} SET ${USER.COLUMNS.DELETED_AT} = (DATETIME('now','localtime')) WHERE ${USER.COLUMNS.ID} = ${id}`);
    } 
    catch (error) {
      throw error;
    }
  }

  async deleteAll(){
    try {
      await this.db.execute(`DELETE FROM ${USER.TABLE}`);
    } 
    catch (error) {
      throw error;
    }
  }



}
