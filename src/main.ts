import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';


if (!localStorage.getItem('users')) {
localStorage.setItem('users', JSON.stringify([
{ id: 1, role: 'HR', email: 'hr@company.com', password: 'hr123' },
{
id: 2,
role: 'USER',
email: 'user@company.com',
password: 'user123',
attendance: ['01-Feb', '02-Feb'],
leaves: [],
wfhs: [],
projects: ['Employee Portal'],
personal: { name: 'Manu', dept: 'IT' }
}
]));
}


bootstrapApplication(App, {
providers: [provideRouter(routes)]
});
