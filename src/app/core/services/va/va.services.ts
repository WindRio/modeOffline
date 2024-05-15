import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class VaService {
  constructor(private http: HttpClient) {
  }
  Domain = "http://192.168.1.44:8082/"

  apiGetVa(): Observable<any>  {
    return this.http.get<any>(this.Domain + "vu-an/get")
  }
  apiDetailVa(id: string): Observable<any>  {
    return this.http.get<any>(this.Domain + "vu-an/get/" + id)
  }
  apiDownVa(): Observable<any>  {
    return this.http.get<any>(this.Domain + "document/download" )
    
  }
}
