import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DCadleService {
urlBase: string = 'https://back-lku7.onrender.com/api/personaje';

constructor(private http: HttpClient) {}

  getPersonaje(): Observable<any> {
    let httpOpttion = {
      headers: new HttpHeaders({}),
      params: new HttpParams(),
    };
    return this.http.get(this.urlBase, httpOpttion);
  }
}
