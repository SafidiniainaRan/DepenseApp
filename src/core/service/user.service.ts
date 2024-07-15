import { Injectable } from '@angular/core';
import { UserRepositoryService } from '../repository/user-repository.service';
import { UserDto } from '../model/Dto';
import { UserViewModel } from '../model/ViewModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userDb: UserRepositoryService) { }

  async getUsers(): Promise<UserViewModel[]>{
    return await this.userDb.findAll();
  }
  async addUSer(user: UserDto){
    await this.userDb.insert(user);
  }
  async deleteUser(id: number){
    await this.userDb.delete(id);
  }
}
