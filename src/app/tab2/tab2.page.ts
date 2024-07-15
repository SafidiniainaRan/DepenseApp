import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { FormMode, MESSAGE } from 'src/core/helper/Constants';
import { SpendMapperService } from 'src/core/mapper/spend-mapper.service';
import { SpendGroup } from 'src/core/model/Model';
import { CategoryViewModel, SpendViewModel } from 'src/core/model/ViewModel';
import { CategoryService } from 'src/core/service/category.service';
import { SpendService } from 'src/core/service/spend.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  spendForm!: FormGroup;

  formMode = FormMode.CREATE;

  typeForm = FormMode;

  isShowFormModal = false;

  spendGroups: SpendGroup[] = [];

  spends: SpendViewModel[] = [];

  categories: CategoryViewModel[] = [];

  totalSpend: number = 0;

  dateFilter: Date = new Date();

  constructor(private fb: FormBuilder, 
              private spendService: SpendService, 
              private categoryService: CategoryService,
              private spendMapper: SpendMapperService,
              private toastController: ToastController
             ) {
    this.initSpendForm();
    this.loadSpend();
    this.loadCategory();
  }
  async loadSpend(){
    this.spends = await this.spendService.findAllByMonthAndYear(this.dateFilter.getMonth() + 1, this.dateFilter.getFullYear());
    this.totalSpend = this.spendService.calculateTotalAmount(this.spends);
    const spendGroupers = this.spendService.groupSpends(this.spends);
    this.spendGroups = this.spendService.orderGroupSpendsAsc(spendGroupers);
  }
  async loadCategory(){
    this.categories = await this.categoryService.findAll();
  }
  initSpendForm(){
    const date = new Date();
    const dateToSet = new Date(date.getFullYear(), date.getMonth(), date.getDate(),Math.abs(date.getTimezoneOffset() / 60));
    this.spendForm = this.fb.group({
      id:[undefined],
      date: [dateToSet.toISOString(), Validators.required],
      idCategory: ['', Validators.required],
      description:[''],
      amount:[10000, Validators.required],
    });
  }

  
  showFormModal(){
    this.isShowFormModal = true;
  }

  closeFormModal(){
    this.isShowFormModal = false;
  }

  showCreateModal(date: Date = new Date()){
    this.initSpendForm();
    const dateToSet = new Date(date.getFullYear(), date.getMonth(), date.getDate(),Math.abs(date.getTimezoneOffset() / 60));
    this.spendForm.patchValue({
      date: dateToSet.toISOString(),
    })
    this.formMode = FormMode.CREATE;
    this.showFormModal();
  }
  showEditModal(spend: SpendViewModel){
    console.log(spend);
    const date = new Date(spend.date.toISOString());
    const dateToSet = new Date(date.getFullYear(), date.getMonth(), date.getDate(),Math.abs(date.getTimezoneOffset() / 60));
   
    this.spendForm.patchValue({
      id: spend.id,
      idCategory: spend.idCategory,
      date: dateToSet.toISOString(),
      description: spend.description,
      amount: spend.amount
    });
    this.formMode = FormMode.EDIT;
    this.showFormModal();

  }

  async createSpend(){
    this.spendService.create(this.spendMapper.mapFbToSpendDto(this.spendForm));
  }
  async submitSpendForm(){

    try{
      console.log(this.spendForm.value);
      console.log(`is valid : ${this.spendForm.valid}`);
      if(this.spendForm.valid){
        if(this.formMode == FormMode.CREATE){
          await this.createSpend();
          this.presentToast(MESSAGE.SUCCESS.CREATE);
        }
        if(this.formMode == FormMode.EDIT){
          await this.editSpend();
          this.presentToast(MESSAGE.SUCCESS.EDIT);
        }
        this.loadSpend();
        this.closeFormModal();
      }
    }
    catch(error){
      console.log(error);
      this.presentToast(MESSAGE.ERROR.GLOBAL);
    }
  }

  async editSpend(){
    await this.spendService.update(this.spendMapper.mapFbToSpendDto(this.spendForm));
  }

  async deleteSpend(id: number){
    try{
      await this.spendService.delete(id);
      await this.loadSpend();
      this.presentToast(MESSAGE.SUCCESS.DELETE);
    }
    catch(error){
      console.log(error);
      this.presentToast(MESSAGE.ERROR.GLOBAL);
    }
  }
  
  async presentToast(message : string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
    });
    await toast.present();
  }

  async handleRefresh(event: any) {
    try{
      await this.loadSpend();
      await this.loadCategory();
    }
    catch(error){
      console.log(error);
      this.presentToast(MESSAGE.ERROR.GLOBAL);
    }finally{
      event.target.complete()
    }
  }
  
  async handleDateChange(e: any){
    console.log(this.dateFilter);
    console.log(e.detail.value)
    this.dateFilter = new Date(e.detail.value);
    console.log("month " + this.dateFilter.getMonth() + "day : "+this.dateFilter.getDate());
    try{
      console.log("load data");
      await this.loadSpend();
      console.log("load data end");
    }
    catch(e){
      console.log(e);
    }
  }

}
