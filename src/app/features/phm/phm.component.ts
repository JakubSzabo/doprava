import {Component, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {Select} from "../../shared/modules/core";
import {Refuel} from "../../shared/modules/refuel";
import {StepperModule} from "primeng/stepper";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {DatePipe} from "@angular/common";
import {BusinessTrip} from "../../shared/modules/route";

@Component({
  selector: 'app-phm',
  standalone: true,
  styleUrl: 'phm.component.scss',
  imports: [
    TranslateModule,
    DropdownModule,
    FormsModule,
    StepperModule,
    Button,
    CalendarModule,
    DatePipe
  ],
  templateUrl: './phm.component.html',
})
export class PhmComponent implements OnInit {
  users: Select[] = [];
  selectedUser?: Select;

  refueling: Refuel[] = [];

  from?: string;
  to?: string;

  date?: Date;
  quantity?: number;
  price?: number;

  paymentMethod: Select[] = [
    {name: "card", code: "CARD"},
    {name: "cash", code: "CASH"}
  ];
  selectedPayment?: Select;

  businessTrip: BusinessTrip[] = [];
  dateBusinessTrip?: Date;
  routeBusinessTrip?: string;
  distanceBusinessTrip?: number;

  ngOnInit(): void {
    this.users = [
      { name: "test1", code: "1" },
      { name: "test2", code: "2" },
      { name: "test3", code: "3" }
    ]
  }

  addRefueling() {
    this.refueling.push({
      date: this.date,
      price: this.price,
      quantity: this.quantity,
      paymentMethod: this.selectedPayment?.code
    })
  }

  addBusinessTrip() {
    this.businessTrip.push({
      date: this.dateBusinessTrip,
      route: this.routeBusinessTrip,
      distance: this.distanceBusinessTrip
    })
  }

  generate() {

  }
}
