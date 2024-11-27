import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { MyKanbanComponent } from './components/my-kanban/my-kanban.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'My-Kanban',
        pathMatch: 'full'
    },
    {
        path: 'My-Kanban',
        component: MyKanbanComponent
    },
    {
        path: 'register-user',
        component: RegistrationComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'sidebar',
        component: SidebarComponent
    }
];
