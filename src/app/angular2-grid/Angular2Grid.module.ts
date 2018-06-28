import { NgModule } from '@angular/core';
import { NgGridDirective } from './ng-grid/ng-grid.directive';
import { NgGridItemDirective } from './ng-grid-item/ng-grid-item.directive';
import { NgGridPlaceholderComponent } from './ng-grid-placeholder/ng-grid-placeholder.component';
import { NgGridItemDraghandleDirective } from './ng-grid-item-draghandle/ng-grid-item-draghandle.directive';

@NgModule({
  declarations:     [ NgGridDirective,  NgGridItemDirective, NgGridPlaceholderComponent, NgGridItemDraghandleDirective ],
  entryComponents:  [ NgGridPlaceholderComponent ],
  exports:          [ NgGridDirective, NgGridItemDirective, NgGridItemDraghandleDirective ]
})
export class Angular2GridModule {}