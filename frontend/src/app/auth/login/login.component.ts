import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SocialAuthService } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private socialAuth: SocialAuthService, private auth: AuthService, private http: HttpClient, private route: Router) { }
  ngOnInit() {
    this.socialAuth.authState.subscribe((res: any) => {
      console.log(res)
      this.auth.socialLogin(res.idToken)
        .subscribe({
          next: (loginRes: any) => {
            console.log('User payload from Google: ', loginRes)
          },
          error: (error: any) => {
            console.log("Something ain't right!", `The error is: ${error.error}`)
          }
        })
    });
  }
}
