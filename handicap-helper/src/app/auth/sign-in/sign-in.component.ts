import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSignIn(form: NgForm) {
    console.log(form.value);
  }

}
