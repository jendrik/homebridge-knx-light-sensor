import type { API, StaticPlatformPlugin, Logger, PlatformConfig, AccessoryPlugin, Service, Characteristic, uuid } from 'homebridge';

import fakegato from 'fakegato-history';

import { Connection } from 'knx';

import { LightSensorAccessory } from './accessory.js';


export class LightSensorPlatform implements StaticPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;
  public readonly uuid: typeof uuid;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly fakeGatoHistoryService: any;

  public readonly connection: Connection;

  private readonly devices: LightSensorAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;
    this.uuid = api.hap.uuid;
    this.fakeGatoHistoryService = fakegato(this.api);

    // connect
    this.connection = new Connection({
      ipAddr: config.ip ?? '224.0.23.12',
      ipPort: config.port ?? 3671,
      handlers: {
        connected: function () {
          log.info('KNX connected');
        },
        error: function (connstatus: unknown) {
          log.error(`KNX status: ${connstatus}`);
        },
      },
    });

    // read devices
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config.devices.forEach((element: any) => {
      if (element.name !== undefined && element.listen_current_ambient_light_level) {
        this.devices.push(new LightSensorAccessory(this, element));
      }
    });
  }

  accessories(callback: (foundAccessories: AccessoryPlugin[]) => void): void {
    callback(this.devices);
  }
}
