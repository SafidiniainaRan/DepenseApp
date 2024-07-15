import { Injectable } from '@angular/core';
import { SpendViewModel } from '../model/ViewModel';
import { FormGroup } from '@angular/forms';
import { SpendDto } from '../model/Dto';

@Injectable({
  providedIn: 'root'
})
export class SpendMapperService {

  constructor() { }

  mapToSpendViewModel(a: any): SpendViewModel {
    const spend = {
      id: a.id,
      idCategory: a.id_category,
      category:a.category,
      date: new Date(a.date),
      amount: a.amount,
      description: a.description,
    }
    return spend;
  }
  mapFbToSpendDto(fb: FormGroup): SpendDto{
    const date = new Date(fb.get('date')?.value.split("T")[0]);
    const id = fb.get('id')?.value;
    const idCategory = fb.get('idCategory')?.value;
    const description = fb.get('description')?.value;
    const amount = fb.get('amount')?.value;
    let dateToSet = new Date(date.getFullYear(), date.getMonth(), date.getDate(),Math.abs(date.getTimezoneOffset() / 60));
    const spend = {
      id,
      idCategory,
      description,
      amount,
      date: dateToSet
    }
    return spend;
  }
}
