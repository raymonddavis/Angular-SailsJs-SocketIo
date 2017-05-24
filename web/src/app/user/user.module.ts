import { ReactiveFormsModule } from '@angular/forms';
import { RdService } from './../services/rd.service';
import { UserComponent } from './user/user.component';
import { UserRoutes } from './user.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdButtonModule, MdCheckboxModule, MdCardModule, MdIconModule, MdInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    UserRoutes,
    MdButtonModule,
    MdCheckboxModule,
    MdCardModule,
    MdIconModule,
    ReactiveFormsModule,
    MdInputModule,
  ],
  declarations: [UserComponent],
  providers: [RdService]
})
export class UserModule { }
