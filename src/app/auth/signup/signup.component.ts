import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignUp(form: NgForm) {
   if (form.invalid || (form.value.password !== form.value.passwordConf)) {
      console.log('passwords do not match');
      return window.alert('Passwords do not match');
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password, form.value.adresse, form.value.tel, form.value.name);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

