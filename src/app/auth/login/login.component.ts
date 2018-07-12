import { Component, OnInit } from '@angular/core';
import { log } from 'util';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  // selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLoginClick(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }

}
