import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Select } from '../../shared/modules/core';
import { PaymentDistanceAndQuantity, PaymentMethod, Refuel } from '../../shared/modules/refuel';
import { StepperModule } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { GeneratedRoutes } from '../../shared/modules/route';
import { PhmService } from './phm.service';
import { jsPDF } from 'jspdf';
import { ROBOTO_FONT_BASE64 } from '../../../assets/fonts/roboto-font';
import { ROBOTO_FONT_BOLD_BASE64 } from '../../../assets/fonts/roboto-font-bold';
import autoTable from 'jspdf-autotable';
import { MatDialog } from '@angular/material/dialog';
import { ShowRoutesDialogComponent } from './show-routes-dialog/show-routes-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../../shared/modules/employee';

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

  date?: Date = new Date();
  quantity?: number;
  distance: number = 0;
  price?: number;

  paymentMethod: Select[] = [
    { name: this.translate.instant('PHM.card'), code: 'CARD' },
    { name: this.translate.instant('PHM.cash'), code: 'CASH' },
  ];
  selectedPayment?: Select;
  generatedRoutes: GeneratedRoutes[] = [];

  constructor(
    private phmService: PhmService,
    private translate: TranslateService,
    private employeeService: EmployeeService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.phmService.getAllUsers().subscribe((res) => {
      this.users = res;
    });
  }

  addRefueling(): void {
    this.refueling.push({
      date: this.date,
      price: this.price,
      quantity: this.quantity,
      paymentMethod: this.selectedPayment?.code,
    });
  }

  isNextEnabled(): boolean {
    return !this.selectedUser || !this.from || !this.to;
  }

  isGenerateEnabled(): boolean {
    return this.refueling.length > 0;
  }

  enabledRefueling(): boolean {
    return !this.date || !this.quantity || !this.price || !this.selectedPayment;
  }

  generateRoutesPreview(): void {
    this.phmService.getUserById(this.selectedUser!.code).subscribe((res: Employee) => {
      const totalFuel = this.refueling.reduce((sum, r) => sum + (r.quantity ?? 0), 0);
      const consumption = res.consumption ?? 0;

      if (consumption > 0) {
        this.distance = Math.round((totalFuel * 100) / consumption);
      } else {
        this.distance = 0;
      }

      console.log('Prejdená vzdialenosť (km):', this.distance);

      if (!this.from || !this.to || !this.distance) return;

      this.phmService.getAllRoute().subscribe((routes) => {
        const workDays: Date[] = [];
        const current = new Date(this.from!);
        const end = new Date(this.to!);

        while (current <= end) {
          const day = current.getDay();
          if (day !== 0 && day !== 6) {
            workDays.push(new Date(current));
          }
          current.setDate(current.getDate() + 1);
        }

        const average = Math.floor(this.distance / workDays.length);
        let remaining = this.distance;

        this.generatedRoutes = workDays.map((day) => {
          const shuffled = routes.slice().sort(() => Math.random() - 0.5);
          let selected =
            shuffled.find((r) => r.distance <= remaining && r.distance >= average) ||
            shuffled.find((r) => r.distance <= remaining) ||
            shuffled[0];

          const route = {
            id: crypto.randomUUID(),
            date: day,
            name: selected.route,
            distance: selected.distance,
          };

          remaining -= selected.distance;
          return route;
        });

        let totalDistance = this.generatedRoutes.reduce((sum, r) => sum + r.distance, 0);

        while (totalDistance > this.distance) {
          let maxIndex = 0;
          for (let i = 1; i < this.generatedRoutes.length; i++) {
            if (this.generatedRoutes[i].distance > this.generatedRoutes[maxIndex].distance) {
              maxIndex = i;
            }
          }

          const currentLongest = this.generatedRoutes[maxIndex];

          const shorterRoutes = routes.filter((r) => r.distance < currentLongest.distance);
          if (shorterRoutes.length === 0) break;

          const replacement = shorterRoutes[Math.floor(Math.random() * shorterRoutes.length)];

          this.generatedRoutes[maxIndex] = {
            ...currentLongest,
            name: replacement.route,
            distance: replacement.distance,
          };

          totalDistance = this.generatedRoutes.reduce((sum, r) => sum + r.distance, 0);
        }

        const dialogRef = this.dialog.open(ShowRoutesDialogComponent, {
          data: { routes: this.generatedRoutes, distance: this.distance },
        });

        dialogRef.afterClosed().subscribe((result: GeneratedRoutes[]) => {
          this.generatedRoutes = result;
          if (result) {
            this.generate();
          }
        });
      });
    });
  }

  private generate(): void {
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

      let odometerData = Number(user.odometer);
      const tableRouteData: (string | number)[][] = [];

      this.generatedRoutes.forEach((route) => {
        tableRouteData.push([
          route.date.toLocaleDateString('sk-SK'),
          route.name,
          '08:00',
          '16:00',
          odometerData,
          route.distance,
        ]);

        odometerData += route.distance;
      });

      const totalDistance = tableRouteData.reduce((sum, row) => sum + Number(row[5]), 0);

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

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: odometerData,
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          const employee: Employee = {
            odometer: odometerData,
          };
          this.employeeService.updateUser(this.selectedUser!.code, employee).subscribe();
        }
      });
    });
  }

  private countPaymentMethods(): PaymentMethod {
    return this.refueling.reduce(
      (acc: PaymentMethod, refuel: Refuel): PaymentMethod => {
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

  private calculateTotals(): PaymentDistanceAndQuantity {
    const totals = {
      card: { distance: 0, quantity: 0 },
      cash: { distance: 0, quantity: 0 },
    };

    this.refueling.forEach((refuel: Refuel): void => {
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
}
