import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CHART } from 'src/core/helper/Constants';
import { SpendMonthlyGroupViewModel } from 'src/core/model/ViewModel';
import { SpendService } from 'src/core/service/spend.service';

@Component({
  selector: 'app-spend-monthly-group',
  templateUrl: './spend-monthly-group.component.html',
  styleUrls: ['./spend-monthly-group.component.scss'],
})
export class SpendMonthlyGroupComponent  implements OnInit {

  public chart: any;

  dateFilter: Date = new Date();

  spendMonthlyGroups: SpendMonthlyGroupViewModel[] = [];

  constructor(private spendService: SpendService) {

  }
  async ngOnInit() {
    await this.loadData();
    this.createChart();
  }

  getDataSet(): any {
    return [{
      label: 'Montant',
      data : this.spendMonthlyGroups.map( sp => sp.amount),
      backgroundColor: CHART.COLORS,
    }]
  }
  getLabels(): string[] {
    return this.spendMonthlyGroups.map( sp => sp.category);
  }

  getData(){
    return {
      labels: this.getLabels(), 
      datasets: this.getDataSet()      
    }
  }
  createChart(){
    this.chart = new Chart("spendMonthlyGroupChart", {
      type: 'doughnut',
      data: this.getData(),
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Depense grouper par mois'
          }
        }
      }
      
    });
  }

  async loadData(){
    this.spendMonthlyGroups = await this.spendService.getSpendMonthlyGroup(this.dateFilter.getMonth() + 1, this.dateFilter.getFullYear());
    console.log(this.spendMonthlyGroups);
  }
  
  async handleDateChange(e: any){
    console.log(this.dateFilter);
    console.log(e.detail.value)
    this.dateFilter = new Date(e.detail.value);
    console.log("month " + (this.dateFilter.getMonth() +1 ) + " day : "+this.dateFilter.getDate());
    await this.loadData();
    this.chart.data = this.getData();
    this.chart.update();
  }

}
