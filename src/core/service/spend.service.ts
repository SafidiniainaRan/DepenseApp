import { Injectable } from '@angular/core';
import { SpendRepositoryService } from '../repository/spend-repository.service';
import { SpendMonthlyGroupViewModel, SpendMonthlyViewModel, SpendViewModel } from '../model/ViewModel';
import { SpendDto } from '../model/Dto';
import { SpendGroup } from '../model/Model';

@Injectable({
  providedIn: 'root'
})
export class SpendService {

  constructor(private spendRepo: SpendRepositoryService) { }

  async findAll(): Promise<SpendViewModel[]>{
    return await this.spendRepo.findAll()
  }
  async findAllByMonthAndYear(month: number, year: number): Promise<SpendViewModel[]>{
    return await this.spendRepo.findAllByMonthYear(month, year);
  }
  async find(id: number): Promise<SpendViewModel | null>{
    return await this.spendRepo.find(id);
  }
  async delete(id: number){
    await this.spendRepo.delete(id);
  }
  async update(spend: SpendDto){
    await this.spendRepo.update(spend);
  }
  async create(spend: SpendDto){
    await this.spendRepo.insert(spend);
  }
  async getSpendMonthlyGroup( month: number, year: number) : Promise<SpendMonthlyGroupViewModel[]>{
    return await this.spendRepo.getSpendMonthlyGroup(month, year);
  }
  async getSpendMonthly(year: number) : Promise<SpendMonthlyViewModel[]>{
    return await this.spendRepo.getSpendMonthly(year);
  }
  calculateTotalAmount(spends: SpendViewModel[]): number{
    return spends.map(x => x.amount).reduce((a, b) => a+b, 0);
  }
  groupSpends(spends: SpendViewModel[]): SpendGroup[] {
    const groupedSpends = spends.reduce((acc, spend) => {
      const spendDate = spend.date.toISOString().split('T')[0]; // Group by date string
      if (!acc[spendDate]) {
          acc[spendDate] = { date: spend.date, spends: [], total: 0 };
      }
      acc[spendDate].spends.push(spend);
      acc[spendDate].total += spend.amount;
      return acc;
    }, {} as { [key: string]: SpendGroup });
  
    return Object.values(groupedSpends);    
  }

  orderGroupSpendsAsc(spendsGp: SpendGroup[]){
    return spendsGp.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
