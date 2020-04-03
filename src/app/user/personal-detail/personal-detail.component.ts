import {OnInit, Component, ViewChild, EventEmitter, Input, Output, ElementRef, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { ModalManager } from 'ngb-modal';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, interval  } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import * as socketIo from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-personal-detail',
  templateUrl: './personal-detail.component.html',
  styleUrls: ['./personal-detail.component.scss']
})
export class PersonalDetailComponent implements OnInit {
  @Input() trigger: string;
  @Output() user_display = new EventEmitter();
  @ViewChild('myModal', {static: false}) myModal;
  user:any = {
    name : '',
    address : ''
  };
  pollingData: any;
  sampleForm: FormGroup;
  private modalRef;
  socket:any;
  widgetId:Number = 2;

  constructor(private modalService: ModalManager,
     private userService: UserService,
      private http: HttpClient,
      private fb: FormBuilder,
      public toastr: ToastrManager) { }
  private subscription: Subscription
  ngOnInit() {
    this.validateForm();
    this.socket = socketIo('https://test-v1-mod.herokuapp.com/');
    this.socket.on('element-comm',(data) => {
      if (data.action === 'ModalView' && this.widgetId !== data.widgetId) {
        this.toastr.warningToastr('User opened modal page ', 'Warning!');
      }
      this.user = data
      if (this.widgetId !== data.widgetId) {
        this.toastr.infoToastr('Some data are loaded.', 'Info!');
      }
    });

    this.subscription = this.userService.getCurrentUserObj().subscribe(value => {
      this.user = value;
      console.log("subscribe",this.user);

      // this.pollingData = interval(1000).switchMap(() => this.http.get(environment.apiUrl + '/users')).subscribe((result: any[]) => {
      //    console.log("from personal details", result);       
      // });
    });
  }


  validateForm() {
    this.sampleForm = this.fb.group({
       name : ['', Validators.required ],
       address: ['', Validators.required ]
    });
    if (this.user.name == '' && this.user.address == '') {
      this.toastr.infoToastr('Widget is new state.', 'Info!');
    }
  }

  submitModalData(data) {
    this.user['name'] = data['name'];
    this.user['address'] = data['address'];
    this.user['widgetId'] = this.widgetId;
    this.userService.setCurrentUserObj(this.user);
    this.socket.emit("element-comm", this.user);

  }

  ngOnDestroy() {
    this.pollingData.unsubscribe();
   }
    
 
  ngOnChanges(changes: SimpleChanges): void {
    console.log('check');
    if (changes.trigger.currentValue === 'VIEW') {
      this.trigger = null;
      this.openModal();
    } else if (changes.trigger.currentValue === 'ADD'){
      this.trigger = null;
      this.addUserDetails(this.user);
    }
}

addUserDetails(user) {
 console.log("initiated", user);

this.userService.addUser(user).subscribe(result => {
  if (result  && result.data) {
     window.alert("success");
    this.user_display.emit(user);
  }
}, error => {
  window.alert("error");
});
}

openModal(){
  this.socket.emit("element-comm", {action : 'ModalView', widgetId : this.widgetId});
  this.modalRef = this.modalService.open(this.myModal, {
      size: "md",
      modalClass: 'mymodal',
      hideCloseButton: false,
      centered: false,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: true,
      backdropClass: "modal-backdrop"
  })
  }

  closeModal(){
    this.modalService.close(this.modalRef);
  }
}
