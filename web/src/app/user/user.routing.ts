import { UserComponent } from './user/user.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full',
  },
  {
    path: 'view',
    component: UserComponent
  }
];

export const UserRoutes = RouterModule.forChild(routes);
