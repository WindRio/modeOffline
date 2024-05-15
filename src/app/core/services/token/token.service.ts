import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TokenService {

  constructor(private http: HttpClient) {
  }

  Domain = "http://localhost:3000"

  token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImlkIjoxLCJ1c2VybmFtZSI6InVzZXIxIiwicGFzc3dvcmQiOiJ1c2VyMSIsInByaXZhdGVLZXkiOiJrZXlVc2VyMSIsImlhdCI6MTcxNTIyNjQ1MywiZXhwIjoxNzE1MjI2NDYwfQ.dCXMpCSjiZuJVbRyxqT79da8DqUWra0us1xTUVuPJhU"



  apiUsbToken(): Observable<any>  {
    return this.http.get<any>(this.Domain)
  }

}
