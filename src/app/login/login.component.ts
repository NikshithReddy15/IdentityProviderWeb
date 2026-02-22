import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './login.component.html'
})
export class LoginComponent { }
