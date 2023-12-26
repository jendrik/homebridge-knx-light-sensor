import { AccessoryConfig, AccessoryPlugin, Service } from 'homebridge';

import { Datapoint } from 'knx';
import fakegato from 'fakegato-history';

import { PLUGIN_NAME, PLUGIN_VERSION, PLUGIN_DISPLAY_NAME } from './settings';

import { LightSensorPlatform } from './platform';


export class LightSensorAccessory implements AccessoryPlugin {
  private readonly uuid_base: string;
  private readonly name: string;
  private readonly displayName: string;

  private readonly listen_current_ambient_light_level: string;

  private readonly lightSensorService: Service;
  private readonly loggingService: fakegato;
  private readonly informationService: Service;

  private ambientLightLevel: number;

  constructor(
    private readonly platform: LightSensorPlatform,
    private readonly config: AccessoryConfig,
  ) {

    this.name = config.name;
    this.listen_current_ambient_light_level = config.listen_current_ambient_light_level;
    this.uuid_base = platform.uuid.generate(PLUGIN_NAME + '-' + this.name + '-' + this.listen_current_ambient_light_level);
    this.displayName = this.uuid_base;

    this.informationService = new platform.Service.AccessoryInformation()
      .setCharacteristic(platform.Characteristic.Name, this.name)
      .setCharacteristic(platform.Characteristic.Identify, this.name)
      .setCharacteristic(platform.Characteristic.Manufacturer, '@jendrik')
      .setCharacteristic(platform.Characteristic.Model, PLUGIN_DISPLAY_NAME)
      .setCharacteristic(platform.Characteristic.SerialNumber, this.displayName)
      .setCharacteristic(platform.Characteristic.FirmwareRevision, PLUGIN_VERSION);

    this.lightSensorService = new platform.Service.LightSensor(this.name);

    this.loggingService = new platform.fakeGatoHistoryService('custom', this, { storage: 'fs', log: platform.log });

    const dp_listen_current_temperature = new Datapoint({
      ga: this.listen_current_ambient_light_level,
      dpt: 'DPT9.004',
      autoread: true,
    }, platform.connection);

    const minPropValue = Number(this.lightSensorService.getCharacteristic(platform.Characteristic.CurrentAmbientLightLevel).props.minValue);
    const maxPropValue = Number(this.lightSensorService.getCharacteristic(platform.Characteristic.CurrentAmbientLightLevel).props.maxValue);

    this.ambientLightLevel = minPropValue;

    dp_listen_current_temperature.on('change', (oldValue: number, newValue: number) => {
      this.ambientLightLevel = Math.max(Math.min(newValue, maxPropValue), minPropValue);
      platform.log.info(`Current Ambient Light Level: ${this.ambientLightLevel}`);
      this.lightSensorService.getCharacteristic(platform.Characteristic.CurrentAmbientLightLevel).updateValue(this.ambientLightLevel);
      this.loggingService._addEntry({ time: Math.round(new Date().valueOf() / 1000), status: this.ambientLightLevel });
    });

    // log light level every 10 minutes
    setInterval(async () => {
      this.loggingService._addEntry({ time: Math.round(new Date().valueOf() / 1000), status: this.ambientLightLevel });
    }, 60 * 10 * 1000);
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.lightSensorService,
      this.loggingService,
    ];
  }
}
