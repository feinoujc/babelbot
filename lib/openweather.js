import request from 'request-promise';
import pkg from '../package.json';

class OpenWeather {
    constructor(appId, unitsKey) {
        if (!appId) throw new ReferenceError('appId is required');
        if (!unitsKey) throw new ReferenceError('unitsKey is required');
        if (!(unitsKey === 'imperial' || unitsKey === 'metric')) throw new RangeError('unitsKey must be in either \'imperial\' or \'metric\'');

        this.defaults =  {
            uri: 'http://api.openweathermap.org/data/2.5/weather',
            qs: {
                units: unitsKey,
                APPID: appId
            },
            headers: {
                'User-Agent': `${pkg.name}/${pkg.version}`
            },
            json: true
        };
    }

    async getWeather(location) {
        const options = {...this.defaults, qs: {...this.defaults.qs, q: location}};
        return await request(options);
    }
}

export default OpenWeather;