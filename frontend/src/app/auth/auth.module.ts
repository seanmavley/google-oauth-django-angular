import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';

@NgModule({
    declarations: [
        LoginComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        AuthRoutingModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        SocialLoginModule,
        GoogleSigninButtonModule,
    ]
})
export class AuthModule { }
