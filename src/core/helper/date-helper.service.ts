import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {

  constructor() { }

  static toStringDbFormat(date : Date): string{
    return `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${(("0"+date.getDate())).slice(-2)}`;
  }

  static toStringLabel(date : Date): string{
    return `${(("0"+date.getDate())).slice(-2)}-${("0"+(date.getMonth()+1)).slice(-2)}-${date.getFullYear()}`;
  }
}
