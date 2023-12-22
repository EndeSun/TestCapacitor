import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  ptfName = Capacitor.getPlatform();
  isNative = Capacitor.isNativePlatform();
  isAvailable = Capacitor.isPluginAvailable('Camera');
  batteryInfo: any;
  devInfo: any;
  devId: any;
  networkStatus: any;
  statusLocation: any;

  location: any = {};

  //Los logs de todos los eventos que suceden
  eventLog: string[] = [];

  constructor(private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      App.exitApp();
    });
  }

  async getBatteryInfo() {
    if (Capacitor.isPluginAvailable('Device')) {
      const info = await Device.getBatteryInfo();
      this.batteryInfo = info;
    } else {
      console.warn(
        'El plugin de Device no está disponible en este dispositivo.'
      );
    }
  }

  async logDeviceInfo() {
    if (Capacitor.isPluginAvailable('Device')) {
      const deviceInfo = await Device.getInfo();
      this.devInfo = deviceInfo;
    } else {
      console.warn(
        'El plugin de Device no está disponible en este dispositivo.'
      );
    }
  }

  async logId() {
    if (Capacitor.isPluginAvailable('Device')) {
      const deviceId = await Device.getId();
      this.devId = deviceId;
    } else {
      console.warn(
        'El plugin de Device no está disponible en este dispositivo.'
      );
    }
  }

  async logCurrentNetworkStatus() {
    if (Capacitor.isPluginAvailable('Network')) {
      const status = await Network.getStatus();
      this.networkStatus = status;
    } else {
      console.log(
        'El plugin de Network no está disponible en este dispositivo.'
      );
    }
  }
  async geolocate() {
    if (Capacitor.isPluginAvailable('Network')) {
      const statusLocation = await Geolocation.checkPermissions();
      this.statusLocation = statusLocation;
      const location = await Geolocation.getCurrentPosition();
      this.location = location;
    } else {
      console.log(
        'El plugin de Geolocation no está disponible en este dispositivo.'
      );
    }
  }

  ngOnInit(): void {
    this.getBatteryInfo();
    this.logDeviceInfo();
    this.logId();
    this.logCurrentNetworkStatus();
    this.geolocate();
    // Configura el plugin Network para capturar cambios en el estado de la conexión
    Network.addListener('networkStatusChange', status => {
      this?.addToEventLog("Cambio tipo conexión a " + status.connectionType);
    });
    // Configura el plugin App para capturar eventos de la aplicación
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
      const appState = isActive ? "onStart" : "onStop";
      this?.addToEventLog(appState);
    });
    App.addListener('resume', () => this?.addToEventLog("OnResume"));
    App.addListener('pause', () => this?.addToEventLog("OnPause"));
  }

  //Función para añadir los eventos de la aplicación en el array
  addToEventLog(event: string) {
    this?.eventLog.push(event);
  }
}
