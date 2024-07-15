import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { FormMode, MESSAGE } from 'src/core/helper/Constants';
import { CategoryMapperService } from 'src/core/mapper/category-mapper.service';
import { CategoryViewModel } from 'src/core/model/ViewModel';
import { CategoryService } from 'src/core/service/category.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  categoryForm!: FormGroup;

  formMode = FormMode.CREATE;

  typeForm = FormMode;

  isShowFormModal = false;
  
  categories: CategoryViewModel[] = [];


  constructor(private categoryService: CategoryService, 
              private categoryMapper: CategoryMapperService,
              private fb: FormBuilder,
              private toastController: ToastController
            ) {
    this.loadCategories().then(() => console.log("categories loaded"));
    this.initCategoryForm();
  }
  initCategoryForm(){
    this.categoryForm = this.fb.group({
      id: [undefined],
      name:['', Validators.required],
    });
  }
  async handleRefresh(event: any) {
    try{
      await this.loadCategories();
    }
    catch(error){
      console.log(error);
      this.presentToast(MESSAGE.ERROR.GLOBAL);
    }finally{
      event.target.complete()
    }
  }
  async loadCategories(){
    try {
      this.categories = await this.categoryService.findAll();
    } catch (error) {
      console.log('try to load category');
      console.log(error);

    }
  }

  async deleteCategory(id: number){
    await this.categoryService.delete(id);
    await this.loadCategories();
  }

  async submitCategoryForm(){
    if(this.formMode === FormMode.CREATE){
      await this.categoryService.create(this.categoryMapper.mapFbToCategoryDto(this.categoryForm));
      this.presentToast(MESSAGE.SUCCESS.CREATE);
    }else{
      await this.categoryService.update(this.categoryMapper.mapFbToCategoryDto(this.categoryForm));
      this.presentToast(MESSAGE.SUCCESS.EDIT);
    }
    await this.loadCategories();
    this.closeFormModal();
  }
  showEditModal(category: CategoryViewModel){
    const categoryDto = this.categoryMapper.mapCategoryViewModelToCategoryDto(category);
    this.categoryForm.patchValue(categoryDto);
    this.formMode = FormMode.EDIT;
    this.showFormModal();
  }
  
  showCreateModal(){
    this.initCategoryForm();
    this.formMode = FormMode.CREATE;
    this.showFormModal();
  }
  

  showFormModal(){
    this.isShowFormModal = true;
  }

  closeFormModal(){
    this.isShowFormModal = false;
  }

  async presentToast(message : string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
    });
    await toast.present();
  }
}
