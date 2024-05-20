import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserRegisterInterface } from '../../shared/users/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = inject(FormBuilder);

  registerForm: FormGroup = this.formBuilder.group({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required),
  });
  private errorOnSubmit = false;

  formInvalid(): boolean {
    return (
      this.registerForm.touched &&
      (this.registerForm.invalid || this.errorOnSubmit)
    );
  }

  @Output() changeAuthType = new EventEmitter();

  onSubmit() {
    this.register();
  }

  private register() {
    if (this.registerForm.invalid) {
      return;
    }

    try {
      const register = this.registerForm.value as UserRegisterInterface;
      this.authService
        .register(register.email, register.username, register.password)
        .subscribe({
          error: () => this.onError(),
          next: () => this.changeAuthType.emit(),
        });
    } catch {
      this.onError();
    }
  }

  private onError() {
    this.registerForm.markAllAsTouched();
    this.errorOnSubmit = true;
  }
}
