import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interface/login.interface';
import { LoginService } from '../core/services';
import { } from 'electron'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: IUser = {
    username: '',
    password: '',
  };
  isOffline: boolean = false;
  constructor(private router: Router, private loginService: LoginService) { }

  onLogin() {
    this.loginService
      .apiLogin(this.user)
      .subscribe((res: { token: string | null; message: string }) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          void this.router.navigate(['/detail']);
        } else {
          alert(res.message);
        }
      });
  }

  onSwitchOffline() {
    window.require('electron').ipcRenderer.send('switchOffline')
    this.isOffline = true
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
  }
}
