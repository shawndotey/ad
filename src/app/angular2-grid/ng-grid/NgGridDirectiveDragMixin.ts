import { Subscription } from "rxjs";
import { NgGridDirectiveBase } from "./NgGridDirectiveBase";

import { NgGridItemDirective } from "../main";
import { Output, EventEmitter, HostListener } from "@angular/core";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER } from "@angular/cdk/overlay/typings/overlay-directives";


export abstract class NgGridDirectiveDragMixin extends NgGridDirectiveBase{

	
	@Output() public onDragStart: EventEmitter<NgGridItemDirective> = new EventEmitter<NgGridItemDirective>();
	@Output() public onDrag: EventEmitter<NgGridItemDirective> = new EventEmitter<NgGridItemDirective>();
	@Output() public onDragStop: EventEmitter<NgGridItemDirective> = new EventEmitter<NgGridItemDirective>();
	
	
	_subscribeDragEvents(){
		this.movables.changes.subscribe(() => {
			console.log('movable.changes')
			this.subscriptions.forEach(s => s.unsubscribe());

			
			this.movables.forEach(movable => {
				this.subscriptions.push(movable.pointerDown.subscribe((event) => {
					let mousePos = this._getMousePosition(event);
					let item = this._getItemFromPosition(mousePos);
			
					if (item == null) return;
			
					if (this.dragEnable) {
						this._dragReady = true;
						this.focusedItem = item;
						const itemPos = item.getPosition();
						this._posOffset = { 'left': (mousePos.left - itemPos.left), 'top': (mousePos.top - itemPos.top) }
			
						event.preventDefault();
					}
				}));
				this.subscriptions.push(movable.pointerUp.subscribe((event) => {
					
					if (this.isDragging) {
						console.log('movable.pointerUp')
						this._dragStop(event);
					} else if (this._dragReady) {
						this._cleanDrag();
						// this._cleanResize();
					}
				}));
				this.subscriptions.push(movable.dragStart.subscribe((event) => {
					console.log('movable.dragStart')
				}));
				this.subscriptions.push(movable.dragMove.subscribe(() => {
					console.log('movable.dragMove');
					if (this._dragReady) {
						this._dragStart(event);
						event.preventDefault();
						return;
					}
			
					if (this.isDragging) {
						this._drag(event);
					} else {
						let mousePos = this._getMousePosition(event);
						let item = this._getItemFromPosition(mousePos);
			
						if (item) {
							item.onMouseMove(event);
						}
					}
				}));
			
			});
		});
		this.movables.notifyOnChanges();

	}

	_dragStop(e: any): void {
		if (!this.isDragging) return;

		this.isDragging = false;

		var itemPos = this.focusedItem.getGridPosition();

		this.focusedItem.setGridPosition(itemPos);
		this._addToGrid(this.focusedItem);

		this._cascadeGrid(null, null, true);
		this._updateSize();

		this.focusedItem.stopMoving();
		this.focusedItem.onDragStopEvent();
		this.onDragStop.emit(this.focusedItem);

		this._cleanDrag();
		this._placeholderRef.destroy();

		this._emitOnItemChange();

		if (this._zoomOnDrag) {
			this._resetZoom();
		}
	}
	_cleanDrag(): void {
		this.focusedItem = null;
		this.focusedItem = null;
		this._posOffset = null;
		this.isDragging = false;
		this._dragReady = false;
	}
	_dragStart(e: any): void {
		if (!this.dragEnable || !this.focusedItem) return;
	
		//	Start dragging
		this.focusedItem.startMoving();
		this._removeFromGrid(this.focusedItem);
		this._createPlaceholder(this.focusedItem);
	
		//	Status Flags
		this.isDragging = true;
		this._dragReady = false;
	
		//	Events
		this.onDragStart.emit(this.focusedItem);
		this.focusedItem.onDragStartEvent();
	
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
		var newL = (mousePos.left - this._posOffset.left);
		var newT = (mousePos.top - this._posOffset.top);

		var itemPos = this.focusedItem.getGridPosition();
		var gridPos = this._calculateGridPosition(newL, newT);
		var dims = this.focusedItem.getSize();

		gridPos = this._fixPosToBoundsX(gridPos, dims);

		if (!this._isWithinBoundsY(gridPos, dims)) {
			gridPos = this._fixPosToBoundsY(gridPos, dims);
		}

		if (gridPos.col != itemPos.col || gridPos.row != itemPos.row) {
			this.focusedItem.setGridPosition(gridPos, this._fixToGrid);
			this._placeholderRef.instance.setGridPosition(gridPos);

			if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
				this._fixGridCollisions(gridPos, dims);
				this._cascadeGrid(gridPos, dims);
			}
		}

		if (!this._fixToGrid) {
			this.focusedItem.setPosition(newL, newT);
		}

		this.onDrag.emit(this.focusedItem);
		this.focusedItem.onDragEvent();
	}
	
	_onMoveGridCascade(){


	}
	// @HostListener('onGridCascade', ['$event'])
	// onCascde(){

	// 	console.log('onGridCascade');
	// }


}