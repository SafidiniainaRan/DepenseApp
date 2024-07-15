import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CHART } from 'src/core/helper/Constants';
import { DateHelperService } from 'src/core/helper/date-helper.service';
import { SpendGroup } from 'src/core/model/Model';
import { SpendViewModel } from 'src/core/model/ViewModel';
import { SpendService } from 'src/core/service/spend.service';

@Component({
  selector: 'app-spend-daily',
  templateUrl: './spend-daily.component.html',
  styleUrls: ['./spend-daily.component.scss'],
})
export class SpendDailyComponent  implements OnInit {

  public chart: any;

  spendGroups: SpendGroup[] = [];

  spends: SpendViewModel[] = [];

  totalSpend: number = 0;

  dateFilter: Date = new Date();

  constructor(private spendService: SpendService) { }

  async ngOnInit() {
    await this.loadSpend();
    this.createChart();
  }

  async loadSpend(){
    this.spends = await this.spendService.findAllByMonthAndYear(this.dateFilter.getMonth() + 1, this.dateFilter.getFullYear());
    this.totalSpend = this.spendService.calculateTotalAmount(this.spends);
    const spendGroupers = this.spendService.groupSpends(this.spends);
    this.spendGroups = this.spendService.orderGroupSpendsAsc(spendGroupers);
  }

  getDataSet(): any {
    return [{
      label: 'Montant',
      data : this.spendGroups.map(x => x.total),
      borderColor: CHART.COLORS[0],
      fill: false,
      tension: 0.4
    }]
  }
  getLabels(): string[] {
    return this.spendGroups.map(x => DateHelperService.toStringLabel(x.date));
  }

  getData(){
    return {
      labels: this.getLabels(), 
      datasets: this.getDataSet()      
    }
  }
  createChart(){
    this.chart = new Chart("spendDailyGroupChart", {
      type: 'line',
      data: this.getData(),
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Depense par jour'
          }
        }
      }
    });
  }

  async handleDateChange(e: any){
    console.log(this.dateFilter);
    console.log(e.detail.value)
    this.dateFilter = new Date(e.detail.value);
    console.log("month " + (this.dateFilter.getMonth() +1 ) + " day : "+this.dateFilter.getDate());
    await this.loadSpend();
    this.chart.data = this.getData();
    this.chart.update();
  }

}
