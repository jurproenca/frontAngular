import { Component } from '@angular/core';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  firstName: string;

  constructor(private authService: AuthService) {
    // Obtém o nome do usuário do serviço de autenticação
    const user = this.authService.getUser();
    this.firstName = user?.fullName?.split(' ')[0] || 'Usuário';

    console.log('Nome do usuário:', this.firstName); // Verifique no console
  }
}
