import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserLoginInterface } from '../../shared/users/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = inject(FormBuilder);

  loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required),
  });
  private errorOnSubmit = false;
  formInvalid(): boolean {
    return (
      this.loginForm.touched && (this.loginForm.invalid || this.errorOnSubmit)
    );
  }

  @Output() loginSuccess = new EventEmitter();
  @Output() changeAuthType = new EventEmitter();

  onSubmit() {
    this.login();
  }

  private login() {
    if (this.loginForm.invalid) {
      return;
    }

    try {
      const login = this.loginForm.value as UserLoginInterface;
      this.authService.login(login.email, login.password).subscribe({
        error: () => this.onError(),
        next: () => this.loginSuccess.emit(),
      });
    } catch {
      this.onError();
    }
  }

  private onError() {
    this.loginForm.markAllAsTouched();
    this.errorOnSubmit = true;
  }
}
