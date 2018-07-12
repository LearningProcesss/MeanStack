import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignupClick(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    this.authService.createUser(loginForm.value.email, loginForm.value.password);
  }

}
