import { Http } from '@angular/http';
import { RdService } from './../../services/rd.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  model = 'users';
  error: string = undefined;
  success: string = undefined;
  canDelete = false;
  selected: any;
  users: Observable<any[]>;

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private DB: RdService, private http: Http) {
    this.DB.use(this.model);
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

  select(entry: any) {
    this.canDelete = true;
    this.form.controls['username'].setValue(entry.username);
    this.form.controls['password'].setValue(entry.password);
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.selected = entry;
  }

  clear() {
    this.canDelete = false;
    this.selected = undefined;
    this.form.reset();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  goOnline() {
    this.selected.online = true;
    this.DB.put(this.selected).subscribe(res => {
      this.success = 'Set Online!';
      setTimeout(() => this.success = undefined, 5000);
    }, error => {
      error = JSON.parse(error._body)

      this.error = error;
      setTimeout(() => this.error = undefined, 5000);
    });
    this.clear();
  }

  goOffline() {
    this.selected.online = false;
    this.DB.put(this.selected).subscribe(res => {
      this.success = 'Set Offline!';
      setTimeout(() => this.success = undefined, 5000);
    }, error => {
      error = JSON.parse(error._body)

      this.error = error;
      setTimeout(() => this.error = undefined, 5000);
    });
    this.clear();
  }

  post() {
    this.error = undefined;
    this.DB.post(this.form.value).subscribe(res => {
      this.success = 'Posted!';
      setTimeout(() => this.success = undefined, 5000);
    }, error => {
      error = JSON.parse(error._body)

      this.error = error;
      setTimeout(() => this.error = undefined, 5000);
    });
    this.clear();
  }

  delete() {
    this.DB.delete(this.selected.id).subscribe(res => {
      this.success = 'Deleted!';
      setTimeout(() => this.success = undefined, 5000);
    }, error => {
      error = JSON.parse(error._body)

      this.error = error;
      setTimeout(() => this.error = undefined, 5000);
    });
    this.clear();
  }
}
