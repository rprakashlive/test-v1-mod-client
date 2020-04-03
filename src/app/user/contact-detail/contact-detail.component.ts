import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import * as socketIo from 'socket.io-client';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, interval  } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../environments/environment';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {
  user:any = {
    email : '',
    phone : ''
  };
  constructor(private userService: UserService, private http: HttpClient,
    public toastr: ToastrManager,
    private fb: FormBuilder) { }
  private subscription: Subscription  
  socket:any;
  sampleForm: FormGroup;
  pollingData: any;
  widgetId:Number = 1;
  ngOnInit() {
    this.validateForm();
    this.socket = socketIo('https://test-v1-mod.herokuapp.com/');
    this.socket.on('element-comm',(data) =>{
      if (data.action === 'ModalView' && this.widgetId != data.widgetId) {
        this.toastr.warningToastr('User opened modal page ', 'Warning!');
        return;
      }
      this.user = data
      if (this.widgetId != data.widgetId) {
        this.toastr.infoToastr('Some data are loaded.', 'Info!');
      }
    });
    this.subscription = this.userService.getCurrentUserObj().subscribe(value => {
      this.user = value;
      console.log("subscribe",this.user);
    });
    // this.pollingData = interval(1000).switchMap(() => this.http.get(environment.apiUrl + '/users')).subscribe((result: any[]) => {
    //   console.log("from contact details", result);               
    // });
  }

  ngOnDestroy() {
    this.pollingData.unsubscribe();
   }

   validateForm() {
    this.sampleForm = this.fb.group({
       email : ['', Validators.required ],
       phone: ['', Validators.required ]
    });
    if (this.user.name == '' && this.user.address == '') {
      this.toastr.infoToastr('Widget is new state.', 'Info!');
    }
  }

  submitModalData(data) {
    this.user['email'] = data['email'];
    this.user['phone'] = data['phone'];
    this.user['widgetId'] = this.widgetId;
    this.userService.setCurrentUserObj(this.user);
    this.socket.emit("element-comm", this.user);
  }
} 
