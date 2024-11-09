import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { OrderlineService } from '../../services/orderline.service';
import { Orderline } from '../../models/orderline.model';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidebarComponent, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  userId !: number;
  orders: Order[] = [];
  showOverlay: boolean = false;
  selectedOrder: Orderline[] = [];


  constructor(private orderService: OrderService, private orderlineService: OrderlineService
    , private productService: ProductService
  ) { }
  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  getAllOrdes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.orderService.getAllOrders().subscribe({
        next: (res) => {
          let allOrders: Order[] = res;
          for (let i = 0; i < allOrders.length; i++) {
            if (allOrders[i].userId === this.userId) {
              this.orders.push(allOrders[i]);
            }
          }
          resolve();
        }
      })
    })
  }
  getAllOrderLine(orderId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.orderlineService.getAllOrderline().subscribe({
        next: (res) => {
          let allOrderLine: Orderline[] = res;
          for (let i = 0; i < allOrderLine.length; i++) {
            if (allOrderLine[i].orderId == orderId) {
              this.selectedOrder.push(allOrderLine[i]);
            }
          }
          resolve();
        }
      })
    })
  }
  getProductById(productId: number): Promise<Product> {
    return new Promise((resolve, reject) => {
      this.productService.getProductById(productId.toString()).subscribe({
        next: (res) => {
          resolve(res);
        }
      })
    })
  }
  ngOnInit(): void {
    this.userId = Number(this.getCookie('id')) || -1;
    this.getAllOrdes();
  }
  async viewDetails(orderid: number) {
    this.selectedOrder = [];
    await this.getAllOrderLine(orderid);
    for (let i = 0; i < this.selectedOrder.length; i++) {
      this.selectedOrder[i].product=await this.getProductById(this.selectedOrder[i].productId);
    }
    console.log(this.selectedOrder);
    //this.selectedOrder = order;
    this.showOverlay = true; // Đảm bảo biến này được đặt thành true khi nhấn vào nút
  }

  closeOverlay() {
    this.showOverlay = false; // Đóng overlay khi nhấn nút X
  }
  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Đã duyệt';
      case 1: return 'Từ chối';
      case 2: return 'Chờ duyệt';
      default: return '';
    }
  }
  // FORMAT VND
  formatCurrencyVND(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
}
