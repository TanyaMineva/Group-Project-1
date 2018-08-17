import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';


@Component({   // Decorator
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  prevScrollpos = window.pageYOffset;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService) {}

  scroll = (): void => {
    const currentScrollPos = window.pageYOffset;
  if (this.prevScrollpos > currentScrollPos) {
    document.getElementById("myNavbar").style.top = "0";
  } else {
    document.getElementById("myNavbar").style.top = "-3.7em";
  }
  this.prevScrollpos = currentScrollPos;
  }


  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

      window.addEventListener('scroll', this.scroll, true);

  }

  onActivate(event) {
    const scrollToTop = window.setInterval(() => {
        const pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 40); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 5);
}
 
 

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

    respNav() {
    const i = document.getElementById('myNavbar');
    if (i.className === 'topnav') {
     i.className += ' responsive';
    } else {
     i.className = 'topnav';
    }
    }
}
