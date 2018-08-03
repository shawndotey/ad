import { Subscription } from "rxjs";

import { AdDraghandleDirective } from '../ad-draghandle/ad-draghandle.directive';
// import  * as AdGridItemUtility  from './../shared/AdGridHelpers';
import { EventEmitter, Output, ContentChildren, QueryList } from '@angular/core';
import { AdGridItemEvent } from "../model";
import { AdGridItemDirectiveBase } from "./AdGridItemDirectiveBase";
import { MixinConstructor } from '../shared/ExtendMixin';


export function AdGridItemDirectiveDragMixin<T extends MixinConstructor<AdGridItemDirectiveBase>>(Base: T) {
	class Mixin extends Base {
		
		@ContentChildren(AdDraghandleDirective, { descendants: true })  dragHandles: QueryList<AdDraghandleDirective>;

		constructor(...args: any[]) {
			super(...args)

			this.onNgAfterContentInit.subscribe(() => {
				
				this.dragHandles.changes.subscribe(() => {
					
					this.dragHandleSubscriptions.forEach(s => s.unsubscribe());
					
					
					this.dragHandles.forEach(dragHandle => {
						this.dragHandleSubscriptions.push(dragHandle.handleDragStart.subscribe((event) => {
							this.onDragStartEvent(event);
						}));
					});
					this.dragHandles.forEach(dragHandle => {
						this.dragHandleSubscriptions.push(dragHandle.handleDragMove.subscribe((event) => {
							this.onDragEvent(event);
						}));
					});
					this.dragHandles.forEach(dragHandle => {
						this.dragHandleSubscriptions.push(dragHandle.handlePointerUp.subscribe((event) => {
							this.onDragStopEvent(event);
						}));
					});
					
				});
				
				this.dragHandles.notifyOnChanges();

				this.elementAdjustmentAsNeed.subscribe(() => {
					this.moveElementAsNeeded();
				});
			});

		

			
		}
		@Output() public onDragStop: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
		@Output() public onDragAny: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
		@Output() public onDragStart: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
		@Output() public onDrag: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
		protected dragHandleSubscriptions: Subscription[] = [];
		
	   //	Private methods
	   
		private onDragStartEvent(event: AdGridItemEvent ): void {
			this.setItemActiveOn();
			this.onDragStart.emit(event);
			this.onDragAny.emit(event);
			this.onChangeStart.emit(event);
			this.onChangeAny.emit(event);
		}
		private onDragEvent(event: AdGridItemEvent ): void {
			this.onDrag.emit(event);
			this.onDragAny.emit(event);
			this.onChange.emit(event);
			this.onChangeAny.emit(event);
		}
		private onDragStopEvent(event: AdGridItemEvent ): void {
			this.setItemActiveOff();
			this.onDragStop.emit(event);
			this.onDragAny.emit(event);
			this.onChangeStop.emit(event);
			this.onChangeAny.emit(event);
			this.onConfigChangeEvent();
		}

		
		
	}
	return Mixin;
}