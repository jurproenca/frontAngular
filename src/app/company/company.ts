import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company.html',
  styleUrls: ['./company.css']
})
export class CompanyComponent {
  isEditing = signal(true);
  isCompanySaved = signal(false);
  
  company = signal({
    companyType: '',
    name: '',
    cnpj: '',
    cep: '',
    address: '',
    district: '',
    state: '',
    city: '',
    complement: '',
    phone: '',
    adminName: '',
    cpf: '',
    email: ''
  });

  validation = signal({
    cnpjValid: true,
    cpfValid: true,
    emailValid: true
  });

  save(form: NgForm) {
    if (form.valid && this.isFormValid()) {
      this.isEditing.set(false);
      this.isCompanySaved.set(true);
    }
  }

  edit() {
    this.isEditing.set(true);
  }

  cancelEdit() {
    if (this.company().name) {
      this.isEditing.set(false);
    }
  }

  isFormValid(): boolean {
    return this.validation().cnpjValid && 
           this.validation().emailValid && 
           this.validation().cpfValid &&
           !!this.company().name && 
           !!this.company().cnpj && 
           !!this.company().phone && 
           !!this.company().adminName && 
           !!this.company().email;
  }

  validateCnpj() {
    const cnpj = this.company().cnpj;
    if (!cnpj) {
      this.validation.update(v => ({...v, cnpjValid: false}));
      return;
    }
    this.validation.update(v => ({...v, cnpjValid: this.isValidCNPJ(cnpj)}));
  }

  validateCpf() {
    const cpf = this.company().cpf;
    if (!cpf) {
      this.validation.update(v => ({...v, cpfValid: true}));
      return;
    }
    this.validation.update(v => ({...v, cpfValid: this.isValidCPF(cpf)}));
  }

  validateEmail() {
    const email = this.company().email;
    if (!email) {
      this.validation.update(v => ({...v, emailValid: false}));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.validation.update(v => ({...v, emailValid: emailRegex.test(email)}));
  }

  searchAddress() {
    const cep = this.company().cep?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (!data.erro) {
          this.company.update(c => ({
            ...c,
            address: data.logradouro,
            district: data.bairro,
            city: data.localidade,
            state: data.uf
          }));
        }
      });
  }

  // Validação de CNPJ
  private isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado === parseInt(digitos.charAt(1));
  }

  // Validação de CPF
  private isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  // Formatação para exibição
  formatCnpj(cnpj: string): string {
    if (!cnpj) return '';
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  formatCpf(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  formatCep(cep: string): string {
    if (!cep) return '';
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  formatPhone(phone: string): string {
    if (!phone) return '';
    if (phone.length === 11) {
      return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    return phone;
  }
}