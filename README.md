# Homebridge KNX Light Sensor

[![npm](https://img.shields.io/npm/v/@jendrik/homebridge-knx-light-sensor)](https://www.npmjs.com/package/@jendrik/homebridge-knx-light-sensor)
[![license](https://img.shields.io/npm/l/@jendrik/homebridge-knx-light-sensor)](LICENSE)
[![homebridge](https://img.shields.io/badge/homebridge-%5E1.8.0%20%7C%7C%20%5E2.0.0-blue)](https://homebridge.io)
[![node](https://img.shields.io/badge/node-%5E20%20%7C%7C%20%5E22%20%7C%7C%20%5E24-green)](https://nodejs.org)

A [Homebridge](https://homebridge.io) plugin that exposes KNX light sensors (lux) to Apple HomeKit. It reads ambient light level values from KNX group addresses via [KNXnet/IP](https://www.knx.org) and includes [Eve](https://www.evehome.com)-compatible history logging via [fakegato-history](https://github.com/simont77/fakegato-history).

## Features

- Reads ambient light level (lux) from KNX group addresses using datapoint type `DPT9.004`
- Supports multiple light sensors per platform instance
- Eve app history logging (lux over time)
- Configurable KNX router/interface IP and port
- Homebridge Config UI X support for easy setup

## Requirements

- [Homebridge](https://homebridge.io) v1.8.0 or later (including v2.0)
- Node.js v20, v22, or v24
- A KNX IP router or interface reachable on the network

## Installation

### Via Homebridge Config UI X (recommended)

Search for `homebridge-knx-light-sensor` in the Homebridge UI plugin search and install it.

### Via CLI

```sh
npm install -g @jendrik/homebridge-knx-light-sensor
```

## Configuration

The plugin can be configured through the Homebridge Config UI X or by editing `config.json` directly.

### Example `config.json`

```json
{
  "platforms": [
    {
      "platform": "knx-light-sensor",
      "ip": "224.0.23.12",
      "port": 3671,
      "devices": [
        {
          "name": "Living Room Light Sensor",
          "listen_current_ambient_light_level": "1/2/3"
        },
        {
          "name": "Bedroom Light Sensor",
          "listen_current_ambient_light_level": "1/2/4"
        }
      ]
    }
  ]
}
```

### Options

| Option | Required | Default | Description |
|--------|----------|---------|-------------|
| `platform` | Yes | — | Must be `knx-light-sensor` |
| `ip` | No | `224.0.23.12` | IP address of the KNX router or interface |
| `port` | No | `3671` | KNX port |
| `devices` | Yes | — | Array of light sensor devices |

### Device Options

| Option | Required | Description |
|--------|----------|-------------|
| `name` | Yes | Display name for the sensor in HomeKit |
| `listen_current_ambient_light_level` | Yes | KNX group address to listen on (e.g. `1/2/3`) |

## Development

### Setup

```sh
git clone https://github.com/jendrik/homebridge-knx-light-sensor.git
cd homebridge-knx-light-sensor
npm install
```

### Build

```sh
npm run build
```

### Lint

```sh
npm run lint
```

### Watch (auto-rebuild + restart Homebridge)

```sh
npm run watch
```

This requires a Homebridge test config at `./test/hbConfig/config.json`.

## License

[Apache-2.0](LICENSE)
