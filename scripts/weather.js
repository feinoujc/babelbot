// Description:
//  Hubot script to show weather for some city
//
// Dependencies:
//   None
//
// Configuration:
//   HUBOT_OWM_APIKEY: required, openweathermap API key
//   HUBOT_WEATHER_UNITS: optional, 'imperial' or 'metric'
//
// Commands:
//   hubot weather in <city> - Show today forecast for interested city.
//
// Author:
//  feinoujc (based on hubot-weather by skibish)
'use strict';

import OpenWeather from '../lib/openweather';

const apikey = process.env.HUBOT_OWM_APIKEY;
const units = process.env.HUBOT_WEATHER_UNITS || 'imperial';
const degreeType = units === 'imperial' ? 'C' : 'F';
const api = apikey ? new OpenWeather(apikey, units) : null;

export default (robot) => {

    if (!api) {
        robot.logger.error('HUBOT_OWM_APIKEY not set');
    }

    robot.respond (/weather in (.*)/i, async (res) => {
        if (!api) {
            return res.send('HUBOT_OWM_APIKEY not set');
        }

        try {
            const data = await api.getWeather(res.match[1]);
            let text = data.message;
            if (!text) {
                text = `Forecast for today in ${data.name}, ${data.sys.country}
Condition: ${data.weather[0].main}, ${data.weather[0].description}
Temperature (min / max): ${data.main.temp_min}°${degreeType} / ${data.main.temp_max}°${degreeType}
Humidity: ${data.main.humidity}%

Last updated: ${new Date(data.dt * 1000)}`;
            }
            res.send(text);
        } catch (err) {
            res.send(`Something terrible happened with the weather: ${err}`);
        }
    });
};
