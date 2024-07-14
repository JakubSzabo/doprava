import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  title: string = "title";
  number: number = 2;

  private clickTest(something: string) {
    console.log(something);
  }


}
