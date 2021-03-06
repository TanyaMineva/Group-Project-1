import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.authService.login(form.value.email, form.value.password);
    console.log('logged in');
    // console.log(this.authService.getToken());
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

