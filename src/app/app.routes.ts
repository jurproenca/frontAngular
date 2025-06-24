import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login";
import { SignupComponent } from "./auth/signup/signup";
import { Home } from "./home/home";
import { CompanyComponent } from "./company/company";

export const routes: Routes = [
  //{ path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: Home},
  { path: 'company', component: CompanyComponent}

  // { 
  //   path: 'company',
  //   children: [
  //     //{ path: 'config', loadComponent: () => import('./company/company') },
  //     //{ path: 'my-company', loadComponent: () => import('./company/company') }

  //     { 
  //       path: 'my-company', 
  //       loadComponent: () => import('./company/company').then(m => m.Company) 
  //     }

  //   ]
  // }
];