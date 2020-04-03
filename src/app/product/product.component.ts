import {OnInit, Component, ViewChild, EventEmitter, Input, Output, ElementRef, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { ModalManager } from 'ngb-modal';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @ViewChild('myModal', {static: false}) myModal;
  
  @Input() name: string;
  @Input() email;
  @Output() display = new EventEmitter();

  private modalRef;
  sampleForm: FormGroup;
  constructor(private modalService: ModalManager, private fb: FormBuilder, private productService: ProductService){}
  user:any = {};
  product:any = {};
  newData:boolean = false;
  
  dataChanged(data) {
    this.product.name = data.toLowerCase();
      this.productService.getProducts({name : this.product.name}).subscribe(result => {
        if (result.data && result.data.length > 0) {
          this.newData = false;
          this.display.emit(result.data[0].desc);     
        } else {
          this.display.emit('Sorry, No match found'); 
          this.newData = true;
        }
      }, error => {
        window.alert("error");
      });
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

  ngOnChanges(changes: SimpleChanges): void {
    // Do your check here
    this.dataChanged(changes.name.currentValue);
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

addProduct(productData){
    var obj = {
      name : this.product.name,
      desc : productData.desc
    }
    this.productService.addProduct(obj).subscribe(result => {
      if (result  && result.data) {
        window.alert("success");
        this.display.emit(result.data.desc);
      }
    }, error => {
      window.alert("error");
    });
}

}
