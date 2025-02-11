import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Select } from '../../shared/modules/core';
import { Refuel } from '../../shared/modules/refuel';
import { StepperModule } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { BusinessTrip } from '../../shared/modules/route';
import { PhmService } from './phm.service';
import { jsPDF } from 'jspdf';
import { ROBOTO_FONT_BASE64 } from '../../../assets/fonts/roboto-font';
import { ROBOTO_FONT_BOLD_BASE64 } from '../../../assets/fonts/roboto-font-bold';
import autoTable from 'jspdf-autotable';

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
    DatePipe,
  ],
  templateUrl: './phm.component.html',
})
export class PhmComponent implements OnInit {
  users: Select[] = [];
  selectedUser?: Select;

  refueling: Refuel[] = [];

  from?: Date;
  to?: Date;

  date?: Date;
  quantity?: number;
  distance: number = 0;
  price?: number;

  paymentMethod: Select[] = [
    { name: this.translate.instant('PHM.card'), code: 'CARD' },
    { name: this.translate.instant('PHM.cash'), code: 'CASH' },
  ];
  selectedPayment?: Select;

  businessTrip: BusinessTrip[] = [];
  dateBusinessTrip?: Date;
  routeBusinessTrip?: string;
  distanceBusinessTrip?: number;

  constructor(
    private phmService: PhmService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.phmService.getAllUsers().subscribe((res) => {
      this.users = res;
    });
  }

  addRefueling() {
    this.refueling.push({
      date: this.date,
      price: this.price,
      quantity: this.quantity,
      paymentMethod: this.selectedPayment?.code,
    });
  }

  addBusinessTrip() {
    this.businessTrip.push({
      date: this.dateBusinessTrip,
      route: this.routeBusinessTrip,
      distance: this.distanceBusinessTrip,
    });
  }

  private calculateTotals() {
    const totals = {
      card: { distance: 0, quantity: 0 },
      cash: { distance: 0, quantity: 0 },
    };

    this.refueling.forEach((refuel) => {
      if (refuel.paymentMethod === 'CARD') {
        totals.card.distance += Number(refuel.price!);
        totals.card.quantity += Number(refuel.quantity!);
      } else if (refuel.paymentMethod === 'CASH') {
        totals.cash.distance += Number(refuel.price!);
        totals.cash.quantity += Number(refuel.quantity!);
      }
    });

    return totals;
  }

  private countPaymentMethods(): { card: number; cash: number } {
    return this.refueling.reduce(
      (acc, refuel) => {
        if (refuel.paymentMethod === 'CARD') {
          acc.card += 1;
        } else if (refuel.paymentMethod === 'CASH') {
          acc.cash += 1;
        }
        return acc;
      },
      { card: 0, cash: 0 }
    );
  }

  generate() {
    this.phmService.getUserById(this.selectedUser?.code ?? '').subscribe((user) => {
      const doc = new jsPDF('p', 'pt', 'a4');
      doc.addFileToVFS('Roboto.ttf', ROBOTO_FONT_BASE64);
      doc.addFileToVFS('Roboto-bold.ttf', ROBOTO_FONT_BOLD_BASE64);
      doc.addFont('Roboto.ttf', 'Roboto', 'normal');
      doc.addFont('Roboto-bold.ttf', 'Roboto', 'bold');

      doc.setFont('Roboto', 'bold');
      doc.setFontSize(12);

      doc.text('Vinárkse závody Topoľčianky, s.r.o., Cintorínska 31, 951 93 Topoľčianky', 50, 50);
      doc.text('VYÚČTOVANIE SPOTREBY POHONNÝCH HMOT (benzín, nafta)', 50, 70);

      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);

      const driver = `Účtovateľ vozidla: ${this.selectedUser?.name}`;
      const city = `Stredisko: Topoľčianky`;

      doc.text(driver, 50, 110);
      doc.text(city, 330, 110);

      const vehicleType = `Typ vozidla: ${user.vehicleType}`;
      const licensePlate = `ŠPZ: ${user.licensePlate}`;

      doc.text(vehicleType, 50, 125);
      doc.text(licensePlate, 330, 125);

      const odometer = `Normovaná spotreba na 100km: ${user.consumption}l/100Km`;
      const from = `${this.from?.getDate()}.${(this.from?.getMonth() ?? 0) + 1}.${this.from?.getFullYear()}`;
      const to = `${this.to?.getDate()}.${(this.to?.getMonth() ?? 0) + 1}.${this.to?.getFullYear()}`;
      const fromTo = `Vyúċtovanie spotreby za obdobie od: ${from}      do: ${to}`;

      doc.text(odometer, 50, 150);
      doc.text('Vlastníctvo vozidla: Firemné', 50, 165);
      doc.text(fromTo, 50, 180);

      doc.text(`1. Počiatočný stav tachometra:`, 100, 210);
      doc.text(`2. Konečný stav tachometra:`, 100, 225);
      doc.text(`3. Ubehnuté km za účtovné obdobie:`, 100, 240);

      doc.text(`${user.odometer}`, 320, 210);
      doc.text(`${Number(user.odometer) + Number(this.distance)}`, 320, 225);
      doc.text(`${this.distance}`, 320, 240);

      doc.text('Litre', 320, 270);
      doc.text('€', 420, 270);

      const total = this.calculateTotals();

      doc.text('Počiatočný stav PHM v nádrži:', 50, 285);
      doc.text(`${user.tankStatus}`, 320, 285);
      doc.text('Tankovanie:', 50, 300);
      doc.text('na karte:', 200, 300);
      doc.text(`${total.card.quantity}`, 320, 300);
      doc.text(`${total.card.distance}`, 420, 300);
      doc.text('za hotovosť:', 200, 315);
      doc.text(`${total.cash.quantity}`, 320, 315);
      doc.text(`${total.cash.distance}`, 420, 315);
      doc.text('zo skladu:', 200, 330);
      doc.text(`0`, 320, 330);
      doc.text(`0`, 420, 330);
      doc.text('Konečný stav PHM v nádrži:', 50, 350);
      doc.text(`${user.tankStatus}`, 320, 350);

      doc.line(50, 355, 340, 355);

      doc.text('Spotreba za účtovné obdobie:', 50, 375);
      doc.text('Skutočná spotreba na 100km:', 50, 390);
      doc.text(`${Number(total.cash.quantity) + Number(total.card.quantity)}`, 320, 375);
      doc.text(`${user.consumption}`, 320, 390);

      doc.text('Prílohy:', 50, 420);
      doc.text('Záznamy o prevádzke vozidla', 125, 420);
      doc.text('1ks', 320, 420);
      doc.text('doklad o nákupe na kraditnú kartu:', 125, 435);
      doc.text(`${this.countPaymentMethods().card} ks`, 320, 435);
      doc.text('doklad o nákupe za hotovosť:', 125, 450);
      doc.text(`${this.countPaymentMethods().cash} ks`, 320, 450);
      doc.text('výdajy zo skladu:', 125, 465);
      doc.text('0ks', 320, 465);

      doc.setFont('Roboto', 'bold');
      doc.text('Nákup pohonných hmôt za účtovné obdobie', 50, 490);

      const tableData = this.refueling.map((refuel) => [
        refuel.date ? refuel.date.toLocaleDateString('sk-SK') : '',
        refuel.quantity ?? '',
        refuel.price ?? '',
        refuel.paymentMethod === 'CARD'
          ? this.translate.instant('PHM.card')
          : this.translate.instant('PHM.cash'),
      ]);

      autoTable(doc, {
        startY: 500,
        head: [['Dátum nákupu', 'Počet litrov', 'Cena (€)', 'Spôsob platby']],
        body: tableData as (string | number)[][],
        theme: 'grid',
        styles: {
          font: 'Roboto',
          fontSize: 10,
          textColor: [0, 0, 0],
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: false,
          textColor: [0, 0, 0],
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.5,
      });

      doc.setFont('Roboto', 'normal');
      doc.text('Schválil: ................', 50, 770);
      doc.text('Predložil: ................', 225, 770);
      doc.text('Podpis účtovnika: ................', 400, 770);
      doc.text('V Topoľčiankach, dňa: ', 50, 800);
      doc.text(`${to}`, 200, 800);

      doc.addPage();

      doc.setFont('Roboto', 'bold');
      doc.text('Záznamy o prevádzke vozidla', 50, 50);

      doc.setFont('Roboto', 'normal');
      doc.text(`Vodič: ${this.selectedUser?.name}`, 50, 70);

      this.phmService.getAllRoute().subscribe((routes) => {
        let currentDate = new Date(this.from!);
        const endDate = new Date(this.to!);
        const workDays: Date[] = [];

        while (currentDate <= endDate) {
          const day = currentDate.getDay();
          if (day !== 0 && day !== 6) {
            workDays.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        let remainingDistance = this.distance;
        let odometer = Number(user.odometer);
        const tableRouteData: (string | number)[][] = [];

        let routeIndex = 0;

        while (remainingDistance > 0 && workDays.length > 0) {
          const travelDate = workDays.shift()!;
          let selectedRoute = routes[routeIndex % routes.length];
          routeIndex++;

          if (selectedRoute.distance > remainingDistance) {
            break;
          }

          tableRouteData.push([
            travelDate.toLocaleDateString('sk-SK'),
            selectedRoute.route,
            '08:00',
            '16:00',
            odometer,
            selectedRoute.distance,
          ]);

          odometer += Number(selectedRoute.distance);
          remainingDistance -= selectedRoute.distance;
        }

        let totalDistance = tableRouteData.reduce((sum, row) => sum + Number(row[5]), 0);

        if (totalDistance < this.distance) {
          const missingDistance = this.distance - totalDistance;

          const exactMatchRoute = routes.find((route) => route.distance === missingDistance);

          if (exactMatchRoute) {
            tableRouteData.pop();
            tableRouteData.push([
              workDays.length > 0 ? workDays.shift()!.toLocaleDateString('sk-SK') : 'N/A',
              exactMatchRoute.route,
              '08:00',
              '16:00',
              odometer,
              exactMatchRoute.distance,
            ]);
            totalDistance = this.distance;
          } else {
            for (let i = 0; i < routes.length; i++) {
              for (let j = 0; j < routes.length; j++) {
                if (routes[i].distance + routes[j].distance === missingDistance) {
                  tableRouteData.pop();
                  tableRouteData.push([
                    workDays.length > 0 ? workDays.shift()!.toLocaleDateString('sk-SK') : 'N/A',
                    routes[i].route,
                    '08:00',
                    '16:00',
                    odometer,
                    routes[i].distance,
                  ]);
                  odometer += routes[i].distance;
                  tableRouteData.push([
                    workDays.length > 0 ? workDays.shift()!.toLocaleDateString('sk-SK') : 'N/A',
                    routes[j].route,
                    '08:00',
                    '16:00',
                    odometer,
                    routes[j].distance,
                  ]);
                  totalDistance = this.distance;
                  break;
                }
              }
              if (totalDistance === this.distance) break;
            }
          }
        }

        tableRouteData.push(['Spolu', '', '', '', '', totalDistance]);

        autoTable(doc, {
          startY: 85,
          head: [['Dátum', 'Cieľ cesty', 'Odchod', 'Príchod', 'Stav počítadla km', 'Ubehnuté km']],
          body: tableRouteData,
          theme: 'grid',
          styles: {
            font: 'Roboto',
            fontSize: 10,
            textColor: [0, 0, 0],
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
          },
          headStyles: {
            fillColor: false,
            textColor: [0, 0, 0],
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
          },
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.5,
        });

        doc.text('V Topoľčiankach, dňa: ', 50, 770);
        doc.text(`${to}`, 200, 770);
        doc.text('Podpis účtovnika: ................', 50, 800);

        doc.save('vygenerovany-dokument.pdf');
      });
    });
  }

  isNextEnabled() {
    return this.selectedUser && this.from && this.to;
  }

  isGenerateEnabled() {
    return this.distance > 0 && this.refueling.length > 0;
  }

  enabledRefueling() {
    return !this.date || !this.quantity || !this.price || !this.selectedPayment;
  }
}
