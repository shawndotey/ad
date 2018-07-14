import { Component, ViewEncapsulation } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(private breakpointObserver: BreakpointObserver){

    
  }
  title = 'app'; 
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

}
