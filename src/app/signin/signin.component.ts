import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Observable } from 'rxjs';
import { UrlService } from '../services/url.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  isLoggedIn = false;
  isLoginFailed = false;
  credentials = {
    email: '',
    password: '',
  };
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  roles: string[] = [];
  previousUrl: string;
  checking: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigate(['/']);
    }

    this.urlService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
  }

  onSubmit() {
    this.checking = true;
    console.log('Your form data : ', this.credentials);
    this.authService.login(this.credentials).subscribe(
      (data) => {
        console.log(data);
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data.user);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        //this.reloadPage();
        // this.router.navigate([
        //   `/${this.roles[1]}/${this.tokenStorage.getUser().id}/profile`,
        // ]);
        console.log('prev url: ', this.previousUrl);
        if (this.previousUrl === '/') {
          this.router.navigate([
            `/${this.roles[1]}/${this.tokenStorage.getUser().id}/profile`,
          ]);
        } else {
          this.router.navigateByUrl(this.previousUrl);
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
