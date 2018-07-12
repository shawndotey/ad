import { NgModule } from '@angular/core';
import { AdGridDirective } from './ad-grid/ad-grid.directive';
import { AdGridItemDirective } from './ad-grid-item/ad-grid-item.directive';
import { AdGridPlaceholderComponent } from './ad-grid-placeholder/ad-grid-placeholder.component';
import { AdGridItemDraghandleDirective } from './ad-grid-item-draghandle/ad-grid-item-draghandle.directive';

@NgModule({
  declarations:     [ AdGridDirective,  AdGridItemDirective, AdGridPlaceholderComponent, AdGridItemDraghandleDirective ],
  entryComponents:  [ AdGridPlaceholderComponent ],
  exports:          [ AdGridDirective, AdGridItemDirective, AdGridItemDraghandleDirective ]
})
export class Angular2GridModule {}