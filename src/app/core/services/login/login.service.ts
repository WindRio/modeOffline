import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUser} from "../../../interface/login.interface";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  Domain = "http://192.168.1.44:8082/user/login"

  apiLogin(body: IUser): Observable<any> {
    console.log('vao roi', body)
    return this.http.post<any>(this.Domain, body)
  }
}
