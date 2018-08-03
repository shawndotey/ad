import { Subscription } from "rxjs";
import { AdGridDirectiveBase } from "./AdGridDirectiveBase";

import { Output, EventEmitter, HostListener, QueryList, ContentChildren } from "@angular/core";
import { MixinConstructor } from "../shared/ExtendMixin";
import { AdGridItemDirective } from "../ad-grid-item/ad-grid-item.directive";

export function AdGridDirectiveDragMixin<T extends MixinConstructor<AdGridDirectiveBase>>(Base: T) {
	class Mixin extends Base {
		public isDragging: boolean = false;
		public dragEnable: boolean = true;
		protected _zoomOnDrag: boolean = false;

		@Output() public onDragStart: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();
		@Output() public onDrag: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();
		@Output() public onDragStop: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();
		protected dragSubscriptions: Subscription[] = [];
		constructor(...args: any[]) {
			super(...args)

			this.onNgAfterContentInit.subscribe(() => {
				this._subscribeDragEvents();
			});
			
		}



		


		_subscribeDragEvents() {

			this.gridItems.changes.subscribe(() => {
				
				this.dragSubscriptions.forEach(s => s.unsubscribe());

				this.gridItems.forEach(movable => {
					this.dragSubscriptions.push(movable.onDragStart.subscribe((event) => {
			
						let mousePos = this._getMousePosition(event);
						let item = this._getItemFromPosition(mousePos);

						if (item == null) return;

						if (this.dragEnable) {
							
							this.focusedItem = item;
							const itemPos = item.getRawPosition();
							this._posOffset = { 'x': (mousePos.x - itemPos.x), 'y': (mousePos.y - itemPos.y) }
							this._dragStart(event);
							event.preventDefault();
						}
					}));
					
					this.dragSubscriptions.push(movable.onDrag.subscribe(() => {
					
						this._drag(event);
					}));
					this.dragSubscriptions.push(movable.onDragStop.subscribe((event) => {
						
						this._dragStop(event);
						this._cleanDrag();
					}));

				});
			});
			this.gridItems.notifyOnChanges();

		}
		// protected _getDraggingMousePosition(e: any): AdGridRawPosition {
		
			
		// 	let mousePosition = this._getMousePosition(e);
		// 	mousePosition.left *= 2;
		// 	mousePosition.top *= 2;
		// 	console.log('_getDraggingMousePosition', mousePosition)
		// 	return mousePosition;
			
		// }
		_dragStop(e: any): void {
			if (!this.isDragging) return;

			this.isDragging = false;

			var itemPos = this.focusedItem.getGridPosition();

			this.focusedItem.setGridPosition(itemPos);
			this._addToGrid(this.focusedItem);

			this._cascadeGrid(null, null, true);
			this._updateSize();

			
			this.onDragStop.emit(this.focusedItem);

			this._cleanDrag();
			this._placeholderRef.destroy();

			this._emitOnItemChange();

			if (this._zoomOnDrag) {
				this._resetZoom();
			}
			this.recalcutateItemDimensionsAsNeeded();
			this.recalcutateItemRawPositionAsNeeded();
			this.moveItemsElementAsNeeded();
			
		}
		_cleanDrag(): void {
			this.focusedItem = null;
			this._posOffset = null;
			this.isDragging = false;
			
		}
		_dragStart(e: any): void {
			if (!this.dragEnable || !this.focusedItem) return;

			//	Start dragging
			
			this._removeFromGrid(this.focusedItem);
			this._createPlaceholder(this.focusedItem);

			//	Status Flags
			this.isDragging = true;
			
			//	Events
			this.onDragStart.emit(this.focusedItem);
			
			//	Zoom
			if (this._zoomOnDrag) {
				this._zoomOut();
			}
		}

		_drag(event: Event): void {
			
			if (!this.isDragging) return;

			if (window.getSelection) {
				if (window.getSelection().empty) {
					window.getSelection().empty();
				} else if (window.getSelection().removeAllRanges) {
					window.getSelection().removeAllRanges();
				}
			} else if ((<any>document).selection) {
				(<any>document).selection.empty();
			}

			var mousePos = this._getMousePosition(event);
			var newL = (mousePos.x - this._posOffset.x);
			var newT = (mousePos.y - this._posOffset.y);

			var itemPos = this.focusedItem.getGridPosition();
			var gridPos = this._calculateGridPositionByRawPosition(newL, newT);
			var dims = this.focusedItem.getGridDimension();

			gridPos = this._fixPosToBoundsX(gridPos, dims);

			if (!this._isWithinBoundsY(gridPos, dims)) {
				gridPos = this._fixPosToBoundsY(gridPos, dims);
			}

			if (gridPos.col != itemPos.col || gridPos.row != itemPos.row) {
				
				this.focusedItem.setGridPosition(gridPos);
				if(this._fixToGrid){
					this.focusedItem.recalculateItemRawPositionByGrid(this.gridDimensions)
					//this.focusedItem.moveElementToCurrentRawPosition();
				
				}
				this._placeholderRef.instance.setGridPosition(gridPos, this.gridDimensions);

				if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
					this._fixGridCollisions(gridPos, dims);
					this._cascadeGrid(gridPos, dims);
				}
			}
			this.recalcutateItemDimensionsAsNeeded();
			this.recalcutateItemRawPositionAsNeeded();
			if (!this._fixToGrid) {
				this.focusedItem.setRawPosition(newL,newT);
			}
			
			this.onDrag.emit(this.focusedItem);
			this.moveItemsElementAsNeeded();
		}

		_onMoveGridCascade() {


		}
		

	}
	return Mixin;
}