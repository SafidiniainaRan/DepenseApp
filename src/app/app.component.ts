import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { DatabaseService } from 'src/core/repository/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private database: DatabaseService) {
    this.initApp();
  }
  async initApp() {
    await this.platform.ready();
    await this.database.initializeDatabase();
    console.log('Database is ready');
    SplashScreen.hide();
  }
}
