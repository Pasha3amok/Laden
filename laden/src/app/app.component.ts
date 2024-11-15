import { Constant } from './constant/constant';
import { MasterService } from './service/master.service';
import { APIResponseModel, Customer, LoginModel } from './model/Product';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'laden';

  registerObj: Customer = new Customer();
  loginObj: LoginModel = new LoginModel();

  loggedUserData: Customer = new Customer();
  masterService = inject(MasterService);

  @ViewChild('registerModal') registerModal: ElementRef | undefined;
  @ViewChild('loginModal') loginModal: ElementRef | undefined;

  ngOnInit(): void {
    const isUser = localStorage.getItem(Constant.LOCAL_KEY);
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }
  }

  openRegisterModel() {
    this.closeLoginModel();
    if (this.registerModal) {
      this.registerModal.nativeElement.style.display = 'block';
    }
  }
  closeRegisterModel() {
    if (this.registerModal) {
      this.registerModal.nativeElement.style.display = 'none';
    }
  }
  onRegister() {
    this.masterService
      .registerNewCustomer(this.registerObj)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          alert('Registration Success');
          this.closeRegisterModel();
        } else {
          alert(res.message);
        }
      });
  }

  openLoginModel() {
    this.closeRegisterModel();
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = 'block';
    }
  }
  closeLoginModel() {
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = 'none';
    }
  }
  onLogin() {
    this.masterService
      .onLogin(this.loginObj)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          this.loggedUserData = res.data;
          localStorage.setItem(Constant.LOCAL_KEY, JSON.stringify(res.data));
          this.closeLoginModel();
        } else {
          alert(res.message);
        }
      });
  }

  logOut() {
    localStorage.removeItem(Constant.LOCAL_KEY);
    this.loggedUserData = new Customer();
  }
}
