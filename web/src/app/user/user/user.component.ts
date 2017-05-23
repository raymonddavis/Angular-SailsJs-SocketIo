import { RdService } from './../../services/rd.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user',
  // templateUrl: './user.component.html',
  template: `
    <li *ngFor="let user of users | async">{{user.username}}</li>
  `,
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: Observable<any[]>;

  constructor(private DB: RdService) {
    this.DB.use('users');
    /**
     * You can also pass an array of what you want to watch for.
     * So if you list post it will watch post, but if Ppostost is left out
     * and their is an array being used then post will not be watched.
     *
     * By default all 'post', 'put', 'delete' are being watched
     */
    /*
    this.DB.use('users', [
      'post',
      'put',
      'delete',
    ]);
    */
  }

  ngOnInit() {
    this.users = this.DB.load();
  }
}
