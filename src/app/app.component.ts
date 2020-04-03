import {OnInit, Component, ViewChild, EventEmitter, Input, Output, ElementRef, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { ModalManager } from 'ngb-modal';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent {
  title = 'custom-element-v1';
  @ViewChild('myModal', {static: false}) myModal;
  
  @Input() name: string;
  @Input() email;
  @Output() display = new EventEmitter();

  private modalRef;
  sampleForm: FormGroup;
  constructor(private modalService: ModalManager, private fb: FormBuilder){}
  user:any = {};
  
  dataChanged(data) {
    if(data.toLowerCase() === 'hi') {
      this.display.emit('Hi, Nice to meet you'); 
    }else if(data.toLowerCase() === 'hello') {
      this.display.emit('Yes, Please'); 
    } else {
      this.display.emit('Sorry, No match found'); 
    } 
  }

  ngOnInit() {
    this.validateForm();
  }

  validateForm() {
    this.sampleForm = this.fb.group({
       first_name : ['', Validators.required ],
       email: ['', Validators.required ]
    });
  }

  openModal(){
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
submitModalData(data) {
  this.user = data;
  this.display.emit(data);
}

closeModal(){
    this.modalService.close(this.modalRef);
}

}
