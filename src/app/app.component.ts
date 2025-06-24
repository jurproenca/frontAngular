import { Component } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router'; // Importe o RouterOutlet

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // Adicione RouterOutlet aqui
  template: '<router-outlet></router-outlet>',
  styles: []
})

export class AppComponent {
   constructor(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navegando para:', event.url);
      }
    });
}}