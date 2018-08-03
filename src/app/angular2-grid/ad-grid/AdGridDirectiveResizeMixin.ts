import { Subscription } from "rxjs";
import { AdGridDirectiveBase } from "./AdGridDirectiveBase";

import { Output, EventEmitter, HostListener, QueryList, ContentChildren } from "@angular/core";
import { MixinConstructor, MixinInjectable } from "../shared/ExtendMixin";
import { AdGridItemDirective } from "../ad-grid-item/ad-grid-item.directive";
import { AdGridItemElementDimension, AdGridItemGridDimension } from "../model";
import { AdGridResizeService } from "./ad-grid-resize.service";

export function AdGridDirectiveResizeMixin<T extends MixinConstructor<AdGridDirectiveBase>>(Base: T) {
	// @MixinInjectable(AdGridResizeService)
	class Mixin extends Base {
		protected resizeSubscriptions: Subscription[] = [];

		//	Event Emitters
		@Output() public onResizeStart: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();
		@Output() public onResize: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();
		@Output() public onResizeStop: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();

		// private resizeService: AdGridResizeService;

		constructor(...args: any[]) {
			super(...args);
			// super(...args.slice(1))
			// this.resizeService = args[0];
			this.onNgAfterContentInit.subscribe(() => {
				this._subscribeResizeEvents();
			});

		}


		protected _resizeStart(): void {
			if (!this.resizeEnable || !this.focusedItem) return;
	
			//	Setup
			this.focusedItem.setItemActiveOn();
			this._removeFromGrid(this.focusedItem);
			this._createPlaceholder(this.focusedItem);
	
			//	Status Flags
			this.isResizing = true;
			this._resizeReady = false;
	
			//	Events
			this.onResizeStart.emit(this.focusedItem);
			this.focusedItem.onResizeStartEvent();
		}
		protected _calculateGridItemDimensionByRawDimension(width: number, height: number): AdGridItemGridDimension {
			width += this.gridDimensions.marginLeft + this.gridDimensions.marginRight;
			height += this.gridDimensions.marginTop + this.gridDimensions.marginBottom;
	
			var sizex = Math.max(this.gridDimensions.minCols, Math.round(width / (this.gridDimensions.colWidth + this.gridDimensions.marginLeft + this.gridDimensions.marginRight)));
			var sizey = Math.max(this.gridDimensions.minRows, Math.round(height / (this.gridDimensions.rowHeight + this.gridDimensions.marginTop + this.gridDimensions.marginBottom)));
	
			if (!this._isWithinBoundsX({ col: 1, row: 1 }, { col: sizex, row: sizey })) sizex = this._maxCols;
			if (!this._isWithinBoundsY({ col: 1, row: 1 }, { col: sizex, row: sizey })) sizey = this._maxRows;
	
			return { 'col': sizex, 'row': sizey };
		}
	
		

		protected _resize(e: any): void {
			if (!this.isResizing) { return; }
	
			if (window.getSelection) {
				if (window.getSelection().empty) {
					window.getSelection().empty();
				} else if (window.getSelection().removeAllRanges) {
					window.getSelection().removeAllRanges();
				}
			} else if ((<any>document).selection) {
				(<any>document).selection.empty();
			}
	
			const mousePos = this._getMousePosition(e);
			const itemPos = this.focusedItem.getRawPosition();
			const itemDims = this.focusedItem.getRawDimensions();
			const endCorner = {
				left: itemPos.x + itemDims.width,
				top: itemPos.y + itemDims.height,
			}
	
			const resizeTop = this._resizeDirection.includes('top');
			const resizeBottom = this._resizeDirection.includes('bottom');
			const resizeLeft = this._resizeDirection.includes('left')
			const resizeRight = this._resizeDirection.includes('right');
	
				// Calculate new width and height based upon resize direction
			let newW = resizeRight
				? (mousePos.x - itemPos.x + 1)
				: resizeLeft
					? (endCorner.left - mousePos.x + 1)
					: itemDims.width;
			let newH = resizeBottom
				? (mousePos.y - itemPos.y + 1)
				: resizeTop
					? (endCorner.top - mousePos.y + 1)
					: itemDims.height;
	
			if (newW < this.gridDimensions.minWidth)
				newW = this.gridDimensions.minWidth;
			if (newH < this.gridDimensions.minHeight)
				newH = this.gridDimensions.minHeight;
			if (newW < this.focusedItem.minWidth)
				newW = this.focusedItem.minWidth;
			if (newH < this.focusedItem.minHeight)
				newH = this.focusedItem.minHeight;
	
			let newX = itemPos.x;
			let newY = itemPos.y;
	
			// if (resizeLeft)
			// 	newX = endCorner.left - newW;
			// if (resizeTop)
			// 	newY = endCorner.top - newH;
	
			 let calcSize = this._calculateGridItemDimensionByRawDimension(newW, newH);
			const itemSize = this.focusedItem.getGridDimension();
			const iGridPos = this.focusedItem.getGridPosition();
			const bottomRightCorner = {
				col: iGridPos.col + itemSize.col,
				row: iGridPos.row + itemSize.row,
			};
			// const targetPos: AdGridItemGridPosition = Object.assign({}, iGridPos);
	
			// if (this._resizeDirection.includes("top"))
			// 	targetPos.row = bottomRightCorner.row - calcSize.height;
			// if (this._resizeDirection.includes("left"))
			// 	targetPos.col = bottomRightCorner.col - calcSize.width;
	
			// if (!this._isWithinBoundsX(targetPos, calcSize))
			// 	calcSize = this._fixSizeToBoundsX(targetPos, calcSize);
	
			// if (!this._isWithinBoundsY(targetPos, calcSize))
			// 	calcSize = this._fixSizeToBoundsY(targetPos, calcSize);
	
			// // let calcSize = this.focusedItem.calculateItemDimensionsByGrid(calcSize, this.gridDimensions);
	
			// if (calcSize.width != itemSize.width || calcSize.height != itemSize.height) {
			// 	this.focusedItem.setGridPosition(targetPos);
				
			// 	this._placeholderRef.instance.setGridPosition(targetPos, this.gridDimensions);
				this.focusedItem.setGridDimension(calcSize);
				
// this._placeholderRef.instance.setSize(calcSize, this.gridDimensions);
	
			// 	if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
			// 		this._fixGridCollisions(targetPos, calcSize);
			// 		this._cascadeGrid(targetPos, calcSize);
			// 	}
			// }
	
			if (!this._fixToGrid) {
				this.focusedItem.setRawDimensions(newW, newH);
				this.focusedItem.setRawPosition(newX, newY)
				
			}
			else{
				this.focusedItem.recalculateAllItemDimensionsByGrid(this.gridDimensions)
			}
			this.onResize.emit(this.focusedItem);
			this.focusedItem.onResizeEvent();
			
			this.focusedItem.onElementAdjustmentNeeded();
	
	
		}
	
		
		protected _resizeStop(): void {
			if (!this.isResizing) return;
	
			this.isResizing = false;
	
			const itemDims = this.focusedItem.getGridDimension();
			this.focusedItem.setGridDimension(itemDims);
	
			const itemPos = this.focusedItem.getGridPosition();
			this.focusedItem.setGridPosition(itemPos);
	
			this._addToGrid(this.focusedItem);
	
			this._cascadeGrid();
			this._updateSize();
	
			this.focusedItem.setItemActiveOff();
			this.focusedItem.onResizeStopEvent();
			this.onResizeStop.emit(this.focusedItem);
	
			
			this._placeholderRef.destroy();
	
			this._emitOnItemChange();
			this.focusedItem.onElementAdjustmentNeeded();
			this._cleanResize();
		}
	
		
	
		protected _cleanResize(): void {
			this.focusedItem = null;
			this._resizeDirection = null;
			this.isResizing = false;
			this._resizeReady = false;
		}


	
	



		_subscribeResizeEvents() {

			this.gridItems.changes.subscribe(() => {
				
				this.resizeSubscriptions.forEach(s => s.unsubscribe());

				this.gridItems.forEach(movable => {
					

				});
			});
			this.gridItems.notifyOnChanges();

		}
		

	}
	return Mixin;
}