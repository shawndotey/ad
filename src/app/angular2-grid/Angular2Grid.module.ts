import { NgModule } from '@angular/core';
import { AdGridDirective } from './ad-grid/ad-grid.directive';
import { AdGridItemDirective } from './ad-grid-item/ad-grid-item.directive';
import { AdGridPlaceholderComponent } from './ad-grid-placeholder/ad-grid-placeholder.component';
import { AdDraghandleDirective } from './ad-draghandle/ad-draghandle.directive';
import { AdResizehandleDirective } from './ad-resizehandle/ad-resizehandle.directive';

@NgModule({
  declarations:     [ AdGridDirective,  AdGridItemDirective, AdGridPlaceholderComponent, AdDraghandleDirective, AdResizehandleDirective ],
  entryComponents:  [ AdGridPlaceholderComponent ],
  exports:          [ AdGridDirective, AdGridItemDirective, AdDraghandleDirective, AdResizehandleDirective ]
})
export class Angular2GridModule {}