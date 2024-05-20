import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RegisterComponent, LoginComponent, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  AuthType = {
    LOGIN: 'LOGIN',
    SIGNUP: 'SIGNUP',
  };

  authType = this.AuthType.LOGIN;

  ngOnInit(): void {
    this.authService.$user.subscribe((user) => {
      if (user) {
        this.onLoginSuccess();
      }
    });
  }

  setAuthType(authType: string) {
    if (authType !== this.AuthType.LOGIN && authType !== this.AuthType.SIGNUP) {
      throw new Error('Invalid auth type');
    }

    this.authType = authType;
  }

  onLoginSuccess() {
    this.router.navigate(['/home']);
  }
}
