import { isPlatformBrowser , DOCUMENT} from '@angular/common';
import { environment } from '../environments/environment';
import { Component, ViewEncapsulation , OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    public ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            let bases = this.document.getElementsByTagName('base');
    
            if (bases.length > 0) {
                bases[0].setAttribute('href', environment.baseHref);
            }
        }
    }

  constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: any, private breakpointObserver: BreakpointObserver) {}
  title = 'angularDash';
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
}
