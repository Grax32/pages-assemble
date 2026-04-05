import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SoftwareProjectsComponent } from './pages/software-projects/software-projects.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'software-projects', component: SoftwareProjectsComponent },
  { path: '**', redirectTo: '' }
];
