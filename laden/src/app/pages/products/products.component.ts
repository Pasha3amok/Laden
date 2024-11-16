import {
  CartModel,
  Category,
  Customer,
  ProductList,
} from './../../model/Product';
import { APIResponseModel } from '../../model/Product';
import { MasterService } from './../../service/master.service';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Constant } from '../../constant/constant';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  productList = signal<ProductList[]>([]);
  categoryList$: Observable<Category[]> = new Observable<Category[]>();
  subscriptionList: Subscription[] = [];

  masterService = inject(MasterService);
  loggedUserData: Customer = new Customer();

  constructor() {
    const isUser = localStorage.getItem(Constant.LOCAL_KEY);
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }
  }

  ngOnInit(): void {
    this.loadAllProducts();
    this.categoryList$ = this.masterService
      .getAllCategory()
      .pipe(map((item) => item.data));
  }

  getProductByCategory(id: number) {
    this.masterService
      .getAllProductsByCategoryId(id)
      .subscribe((result: APIResponseModel) => {
        this.productList.set(result.data);
      });
  }

  loadAllProducts() {
    this.subscriptionList.push(
      this.masterService
        .getAllProducts()
        .subscribe((result: APIResponseModel) => {
          this.productList.set(result.data);
        })
    );
  }

  onAddToCart(productId: number) {
    const cartObj: CartModel = new CartModel();
    cartObj.ProductId = productId;
    cartObj.custId = this.loggedUserData.custId;
    this.masterService.addToCart(cartObj).subscribe((res: APIResponseModel) => {
      if (res.result) {
        alert('Product added to cart');
        this.masterService.onCartAdded.next(true);
      } else {
        alert(res.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((element) => {
      element.unsubscribe();
    });
  }
}
