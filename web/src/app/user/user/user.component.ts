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
  MODEL_NAME = 'users';
  SERVER_URL = 'http://localhost:3000';
  error: string = undefined;
  success: string = undefined;
  canDelete = false;
  selected: any;
  users: Observable<any[]>;

  route = '';

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private DB: RdService, private http: Http) {
    this.DB.use(this.SERVER_URL, this.MODEL_NAME);

    /**
     * SERVER_URL: required, string
     * MODEL_NAME: required, string
     * OPTIONS: not required, object
     *  load: string <- The route you want to load you data from on init
     */
    /*
    this.DB.use('SERVER_URL, MODEL_NAME [
      'post',
      'put',
      'delete',
    ]);
    */
  }

  ngOnInit() {
    /**
     * By default it will load from `${this.serverUrl}/${this.model}` but you can you whatever custom route you have.
     * Just pass the custom route into the load function as a string.
     */
    this.users = this.DB.load();
  }

  changeData() {
    if (!this.route) {
      this.users = this.DB.load('http://localhost:3000/users?limit=5');
      this.route = 'http://localhost:3000/users?limit=5';
    } else {
      this.users = this.DB.load();
      this.route = '';
    }
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
