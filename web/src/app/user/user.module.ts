import { RdService } from './../services/rd.service';
import { UserComponent } from './user/user.component';
import { UserRoutes } from './user.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    UserRoutes
  ],
  declarations: [UserComponent],
  providers: [RdService]
})
export class UserModule { }
