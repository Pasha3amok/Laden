import { CartData, OrderModel } from './../../model/Product';
import { APIResponseModel } from '../../model/Product';
import { MasterService } from './../../service/master.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss',
})
export class CreateOrderComponent implements OnInit {
  masterService = inject(MasterService);
  cartData: CartData[] = [];
  totalAmount: number = 0;
  orderObj: OrderModel = new OrderModel();

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems() {
    this.masterService
      .getCartProductsByCustomerId(this.masterService.loggedUserData.custId)
      .subscribe((res: APIResponseModel) => {
        this.cartData = res.data;
        this.cartData.forEach((element) => {
          this.totalAmount = this.totalAmount + element.productPrice;
        });
      });
  }

  placeOrder() {
    this.orderObj.CustId = this.masterService.loggedUserData.custId;
    this.orderObj.TotalInvoiceAmount = this.totalAmount;
    this.masterService
      .onPlaceOrder(this.orderObj)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          alert('Order place succsesfully');
          this.getCartItems();
          this.orderObj = new OrderModel();
        } else {
          alert(res.message);
        }
      });
  }
}
