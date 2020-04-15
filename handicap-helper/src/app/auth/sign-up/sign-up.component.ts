import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  // used for spinner
  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  /**
   * Method used for a user to sign-up for Handi-Tracker using
   * AuthService.
   * @param form for sign-up form
   */
  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

}
