import { Injectable } from '@angular/core';
import { Jsonp, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'

import c from '../constants/constants';

@Injectable()
export class WeatherService {

    constructor(private jsonp: Jsonp, private http: Http) {}

    getCurrentLocation(): Observable<any> {
        if(navigator.geolocation ) {
            return Observable.create(observer => {
                navigator.geolocation.getCurrentPosition(pos => {
                    observer.next(pos);
                }),
            err => {
                return Observable.throw(err);
            }
        });
        } else {
            return Observable.throw("Geolocation is not available");
        }
    }

    getCurrentWeather(lat: number, long: number): Observable<any>{
        const url = c.FORECAST_ROOT + c.FORECAST_KEY + "/" + lat + "," + long;
        const queryParams = "?callback=JSONP_CALLBACK";

        return this.jsonp.get(url + queryParams)
        .map(data => data.json())
        .catch(err => {
            console.error("Unable to get weather data - ", err);
            return Observable.throw(err.json())
        });
    }

    getLocationName(lat: number, long: number): Observable<any> {
        const url = c.GOOGLE_ROOT;
        const queryParams = "?latlng=" + lat + "," + long + "&key=" + c.GOOGLE_KEY;

        return this.http.get(url + queryParams)
            .map(loc => loc.json())
            .catch(err => {
                console.log("Unable to get location - ", err);
                return Observable.throw(err);
            })
    }
}