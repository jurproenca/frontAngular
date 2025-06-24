import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
    standalone: true, // <-- Componente standalone
  imports: [
    CommonModule,
    ReactiveFormsModule, // <-- ESSA LINHA RESOLVE O ERRO
    RouterModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
   private fb = inject(FormBuilder); // <-- Nova forma de injeção

  signupForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue]
  }, { validator: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  constructor(
    //private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.signupForm.valid) {
      // Simular criação de conta
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err: any) => console.error('Signup error:', err)
      });
    }
  }
}