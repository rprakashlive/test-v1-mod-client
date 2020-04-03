import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, ComponentFactoryResolver } from '@angular/core';
import { createCustomElement } from "@angular/elements";
import { ModalModule } from 'ngb-modal';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';

// without using angular elements
import { AngularCustomElementsBridge } from './angular-elements-bridge';
import { CustomElementsWrapper } from './custom-elements-wrapper';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { PersonalDetailComponent } from './user/personal-detail/personal-detail.component';
import { ContactDetailComponent } from './user/contact-detail/contact-detail.component';
import { ToastrModule } from 'ng6-toastr-notifications';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ProductDetailComponent,
    PersonalDetailComponent,
    ContactDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    ModalModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [ProductComponent, PersonalDetailComponent, ContactDetailComponent]
})
export class AppModule {
  constructor(private injector: Injector) {}


  // ngDoBootstrap() {
  //   const factory = this.injector
  //     .get(ComponentFactoryResolver)
  //     .resolveComponentFactory(AppComponent);
  //   const bridge = new AngularCustomElementsBridge(this.injector, AppComponent, factory);
  //   bridge.prepare();
  //   CustomElementsWrapper.bridge = bridge;
  //   factory.inputs
  //     .map(({ propName }) => propName)
  //     .forEach(property => {
  //       Object.defineProperty(CustomElementsWrapper.prototype, property, {
  //         get: function() {
  //           return bridge.getInput(property);
  //         },
  //         set: function(newValue: any) {
  //           bridge.setInput(property, newValue);
  //         },
  //         configurable: true,
  //         enumerable: true
  //       });
  //     });
  //   customElements.define('app-root', CustomElementsWrapper);
  // }
  
  ngDoBootstrap() {
    const el = createCustomElement(ProductComponent, { injector: this.injector });
    customElements.define('app-product', el as any);

    // const el2 = createCustomElement(ProductDetailComponent, { injector: this.injector });
    // customElements.define('app-product-detail', el2 as any);

    const el3 = createCustomElement(PersonalDetailComponent, { injector: this.injector });
    customElements.define('app-personal-detail', el3 as any);

    const el4 = createCustomElement(ContactDetailComponent, { injector: this.injector });
    customElements.define('app-contact-detail', el4 as any);
    
   }


 }
