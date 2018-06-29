import { NgGridDirectiveBase } from "./NgGridDirectiveBase";

import { NgGridDirectiveDragMixin } from "./NgGridDirectiveDragMixin";

import { Component, Directive, ElementRef, Renderer, EventEmitter, ComponentFactoryResolver, Host, ViewEncapsulation, Type, ComponentRef, KeyValueDiffer, KeyValueDiffers, OnInit, OnDestroy, DoCheck, ViewContainerRef, Output, QueryList, ContentChildren, HostListener } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { NgGridItemEvent } from "../model/NgGridItem/NgGridItemEvent";
import { NgGridItemSize } from "../model/NgGridItem/NgGridItemSize";
import { NgGridItemPosition } from "../model/NgGridItem/NgGridItemPosition";
import { NgGridRawPosition } from "../model/NgGrid/NgGridRawPosition";
import { NgGridItemDimensions } from "../model/NgGridItem/NgGridItemDimensions";
import { NgConfigFixDirection } from "../model/NgConfigFixDirection";
import { NgGridConfig } from "../model/NgGrid/NgGridConfig";
import { NgGridPlaceholderComponent } from './../ng-grid-placeholder/ng-grid-placeholder.component';
import { NgGridItemDirective } from '../ng-grid-item/ng-grid-item.directive';
import * as NgGridHelper from "../shared/NgGridHelpers";
import { NgGridItemDraghandleDirective } from "../ng-grid-item-draghandle/ng-grid-item-draghandle.directive";


@NgGridHelper.ExtendMixin(NgGridDirectiveDragMixin)
@Directive({
	selector: '[ngGrid]',
	inputs: ['config: ngGrid'],
	host: {
		'(window:resize)': 'resizeEventHandler($event)',
	}
})
export class NgGridDirective extends NgGridDirectiveBase implements OnInit, DoCheck, OnDestroy, NgGridDirectiveDragMixin {
	//_draggingItem: NgGridItemDirective;
	_drag(arg0: any): any {
		console.log("################ERROR")
		throw new Error("Method not implemented.");
	}
	_dragStop(e: any): void	{
		throw new Error("Method not implemented.");
	}
	_cleanDrag(): void {
		throw new Error("Method not implemented.");
	}
	_onMoveGridCascade(): void {
		throw new Error("Method not implemented.");
	}
	_subscribeDragEvents(): void {
		console.log("################ERROR")
		throw new Error("Method not implemented.");
	}
	ngAfterContentInit(): void {
		
		this._subscribeDragEvents();
		
	}

//Drag  stand-in properties

	_dragStart:(e: any) => void;
	@Output() public onDragStart: EventEmitter<NgGridItemDirective>;
	@Output() public onDrag: EventEmitter<NgGridItemDirective>;
	@Output() public onDragStop: EventEmitter<NgGridItemDirective>;
	//Drag to refactor


	//	Event Emitters
	@Output() public onResizeStart: EventEmitter<NgGridItemDirective> = new EventEmitter<NgGridItemDirective>();
	@Output() public onResize: EventEmitter<NgGridItemDirective> = new EventEmitter<NgGridItemDirective>();
	@Output() public onResizeStop: EventEmitter<NgGridItemDirective> = new EventEmitter<NgGridItemDirective>();
	
	
	
	
	protected _config = NgGridDirective.CONST_DEFAULT_CONFIG;

	//	[ng-grid] attribute handler
	set config(v: NgGridConfig) {
		if (v == null || typeof v !== "object") {
			return;
		}

		this.setConfig(v);

		if (this._differ == null && v != null) {
			this._differ = this._differs.find(this._config).create();
		}

		this._differ.diff(this._config);
	}

	//	Constructor
	constructor(
		protected _differs: KeyValueDiffers,
		protected _ngEl: ElementRef,
		protected _renderer: Renderer,
		protected componentFactoryResolver: ComponentFactoryResolver,
	) {
		super(_differs,_ngEl,_renderer,componentFactoryResolver);
		this._defineListeners();
	}

	//	Public methods
	public ngOnInit(): void {
		this._renderer.setElementClass(this._ngEl.nativeElement, 'grid', true);
		if (this.autoStyle) this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'relative');
		this.setConfig(this._config);
	}

	public ngOnDestroy(): void {
		this._destroyed = true;
		this._disableListeners();
	}

	public generateItemUid(): string {
		const uid: string = NgGridHelper.generateUuid();

		if (this._items.has(uid)) {
			return this.generateItemUid();
		}

		return uid;
	}

	public setConfig(config: NgGridConfig): void {
		this._config = config;

		var maxColRowChanged = false;
		for (var x in config) {
			var val = config[x];
			var intVal = !val ? 0 : parseInt(val);

			switch (x) {
				case 'margins':
					this.setMargins(val);
					break;
				case 'col_width':
					this.colWidth = Math.max(intVal, 1);
					break;
				case 'row_height':
					this.rowHeight = Math.max(intVal, 1);
					break;
				case 'auto_style':
					this.autoStyle = val ? true : false;
					break;
				case 'auto_resize':
					this._autoResize = val ? true : false;
					break;
				case 'draggable':
					this.dragEnable = val ? true : false;
					break;
				case 'resizable':
					this.resizeEnable = val ? true : false;
					break;
				case 'max_rows':
					maxColRowChanged = maxColRowChanged || this._maxRows != intVal;
					this._maxRows = intVal < 0 ? 0 : intVal;
					break;
				case 'max_cols':
					maxColRowChanged = maxColRowChanged || this._maxCols != intVal;
					this._maxCols = intVal < 0 ? 0 : intVal;
					break;
				case 'visible_rows':
					this._visibleRows = Math.max(intVal, 0);
					break;
				case 'visible_cols':
					this._visibleCols = Math.max(intVal, 0);
					break;
				case 'min_rows':
					this.minRows = Math.max(intVal, 1);
					break;
				case 'min_cols':
					this.minCols = Math.max(intVal, 1);
					break;
				case 'min_height':
					this.minHeight = Math.max(intVal, 1);
					break;
				case 'min_width':
					this.minWidth = Math.max(intVal, 1);
					break;
				case 'zoom_on_drag':
					this._zoomOnDrag = val ? true : false;
					break;
				case 'cascade':
					if (this.cascade != val) {
						this.cascade = val;
						this._cascadeGrid();
					}
					break;
				case 'fix_to_grid':
					this._fixToGrid = val ? true : false;
					break;
				case 'maintain_ratio':
					this._maintainRatio = val ? true : false;
					break;
				case 'prefer_new':
					this._preferNew = val ? true : false;
					break;
				case 'limit_to_screen':
					this._limitToScreen = !this._autoResize && !!val;
					break;
				case 'center_to_screen':
					this._centerToScreen = val ? true : false;
					break;
				case 'element_based_row_height':
					this._elementBasedDynamicRowHeight = !!val;
					break;
				case 'fix_item_position_direction':
					this._itemFixDirection = val;
					break;
				case 'fix_collision_position_direction':
					this._collisionFixDirection = val;
					break;
			}
		}

		if (this.dragEnable || this.resizeEnable) {
			this._enableListeners();
		} else {
			this._disableListeners();
		}

		if (this._itemFixDirection === "cascade") {
			this._itemFixDirection = this._getFixDirectionFromCascade();
		}

		if (this._collisionFixDirection === "cascade") {
			this._collisionFixDirection = this._getFixDirectionFromCascade();
		}

		if (this._limitToScreen) {
			const newMaxCols = this._getContainerColumns();

			if (this._maxCols != newMaxCols) {
				this._maxCols = newMaxCols;
				maxColRowChanged = true;
			}
		}

		if (this._limitToScreen && this._centerToScreen) {
			this.screenMargin = this._getScreenMargin();
		} else {
			this.screenMargin = 0;
		}

		if (this._maintainRatio) {
			if (this.colWidth && this.rowHeight) {
				this._aspectRatio = this.colWidth / this.rowHeight;
			} else {
				this._maintainRatio = false;
			}
		}

		if (maxColRowChanged) {
			if (this._maxCols > 0 && this._maxRows > 0) {	//	Can't have both, prioritise on cascade
				switch (this.cascade) {
					case 'left':
					case 'right':
						this._maxCols = 0;
						break;
					case 'up':
					case 'down':
					default:
						this._maxRows = 0;
						break;
				}
			}

			this._updatePositionsAfterMaxChange();
		}

		this._calculateColWidth();
		this._calculateRowHeight();

		var maxWidth = this._maxCols * this.colWidth;
		var maxHeight = this._maxRows * this.rowHeight;

		if (maxWidth > 0 && this.minWidth > maxWidth) this.minWidth = 0.75 * this.colWidth;
		if (maxHeight > 0 && this.minHeight > maxHeight) this.minHeight = 0.75 * this.rowHeight;

		if (this.minWidth > this.colWidth) this.minCols = Math.max(this.minCols, Math.ceil(this.minWidth / this.colWidth));
		if (this.minHeight > this.rowHeight) this.minRows = Math.max(this.minRows, Math.ceil(this.minHeight / this.rowHeight));

		if (this._maxCols > 0 && this.minCols > this._maxCols) this.minCols = 1;
		if (this._maxRows > 0 && this.minRows > this._maxRows) this.minRows = 1;

		this._updateRatio();

		this._items.forEach((item: NgGridItemDirective) => {
			this._removeFromGrid(item);
			item.setCascadeMode(this.cascade);
		});

		this._items.forEach((item: NgGridItemDirective) => {
			item.recalculateSelf();
			this._addToGrid(item);
		});

		this._cascadeGrid();
		this._updateSize();
	}

	public getItemPosition(itemId: string): NgGridItemPosition {
		return this._items.has(itemId) ? this._items.get(itemId).getGridPosition() : null;
	}

	public getItemSize(itemId: string): NgGridItemSize {
		return this._items.has(itemId) ? this._items.get(itemId).getSize() : null;
	}

	public ngDoCheck(): boolean {
		if (this._differ != null) {
			var changes = this._differ.diff(this._config);

			if (changes != null) {
				this._applyChanges(changes);

				return true;
			}
		}

		return false;
	}

	public setMargins(margins: Array<string>): void {
		this.marginTop = Math.max(parseInt(margins[0]), 0);
		this.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1]), 0) : this.marginTop;
		this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
		this.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3]), 0) : this.marginRight;
	}

	public enableDrag(): void {
		this.dragEnable = true;
	}

	public disableDrag(): void {
		this.dragEnable = false;
	}

	public enableResize(): void {
		this.resizeEnable = true;
	}

	public disableResize(): void {
		this.resizeEnable = false;
	}
	
	public addItem(ngItem: NgGridItemDirective): void {
		ngItem.setCascadeMode(this.cascade);

		if (!this._preferNew) {
			var newPos = this._fixGridPosition(ngItem.getGridPosition(), ngItem.getSize());
			ngItem.setGridPosition(newPos);
		}

		if (ngItem.uid === null || this._items.has(ngItem.uid)) {
			ngItem.uid = this.generateItemUid();
		}

		this._items.set(ngItem.uid, ngItem);
		this._addToGrid(ngItem);

		this._updateSize();

		this.triggerCascade().then(() => {
			ngItem.recalculateSelf();
			ngItem.onCascadeEvent();

			this._emitOnItemChange();
		});

	}

	public removeItem(ngItem: NgGridItemDirective): void {
		this._removeFromGrid(ngItem);

		this._items.delete(ngItem.uid);

		if (this._destroyed) return;

		this.triggerCascade().then(() => {
			this._updateSize();
			this._items.forEach((item: NgGridItemDirective) => item.recalculateSelf());
			this._emitOnItemChange();
		});
	}

	public updateItem(ngItem: NgGridItemDirective): void {
		this._removeFromGrid(ngItem);
		this._addToGrid(ngItem);

		this.triggerCascade().then(() => {
			this._updateSize();
			ngItem.onCascadeEvent();
		});
	}

	public triggerCascade(): Promise<void> {
		if (!this._cascadePromise) {
			this._cascadePromise = new Promise<void>((resolve: () => void) => {
				setTimeout(() => {
					this._cascadePromise = null;
					this._cascadeGrid(null, null);
					resolve();
				}, 0);
			});
		}

		return this._cascadePromise;
	}

	public triggerResize(): void {
		this.resizeEventHandler(null);
	}

	public resizeEventHandler(e: any): void {
		this._calculateColWidth();
		this._calculateRowHeight();

		this._updateRatio();

		if (this._limitToScreen) {
			const newMaxColumns = this._getContainerColumns();
			if (this._maxCols !== newMaxColumns) {
				this._maxCols = newMaxColumns;
				this._updatePositionsAfterMaxChange();
				this._cascadeGrid();
			}

			if (this._centerToScreen) {
				this.screenMargin = this._getScreenMargin();

				this._items.forEach((item: NgGridItemDirective) => {
					item.recalculateSelf();
				});
			}
		} else if (this._autoResize) {
			this._items.forEach((item: NgGridItemDirective) => {
				item.recalculateSelf();
			});
		}

		this._updateSize();
	}

	public mouseDownEventHandler(e: MouseEvent | TouchEvent): void {
		var mousePos = this._getMousePosition(e);
		var item = this._getItemFromPosition(mousePos);

		if (item == null) return;

		const resizeDirection: string = item.canResize(e);

		if (this.resizeEnable && resizeDirection) {
			this._resizeReady = true;
			this._resizingItem = item;
			this.focusedItem = item;
			this._resizeDirection = resizeDirection;

			e.preventDefault();
		} else if (this.dragEnable && item.canDrag(e)) {
			this._dragReady = true;
			this.focusedItem = item;

			const itemPos = item.getPosition();
			this._posOffset = { 'left': (mousePos.left - itemPos.left), 'top': (mousePos.top - itemPos.top) }

			e.preventDefault();
		}
	}

	public mouseUpEventHandler(e: MouseEvent | TouchEvent): void {
		// if (this.isDragging) {
		// 	this._dragStop(e);
		// } else 
		if (this.isResizing) {
			this._resizeStop(e);
		} else if (this._dragReady || this._resizeReady) {
			// this._cleanDrag();
			this._cleanResize();
		}
	}

	public mouseMoveEventHandler(e: MouseEvent | TouchEvent): void {
		if (this._resizeReady) {
			this._resizeStart(e);
			e.preventDefault();
			return;
		} else if (this._dragReady) {
			this._dragStart(e);
			e.preventDefault();
			return;
		}

		if (this.isDragging) {
			this._drag(e);
		} else if (this.isResizing) {
			this._resize(e);
		} else {
			var mousePos = this._getMousePosition(e);
			var item = this._getItemFromPosition(mousePos);

			if (item) {
				item.onMouseMove(e);
			}
		}
	}

	//	protected methods
	protected _getFixDirectionFromCascade(): NgConfigFixDirection {
		switch (this.cascade) {
			case "up":
			case "down":
			default:
				return "vertical";
			case "left":
			case "right":
				return "horizontal";
		}
	}
	protected _updatePositionsAfterMaxChange(): void {
		this._items.forEach((item: NgGridItemDirective) => {
			var pos = item.getGridPosition();
			var dims = item.getSize();

			if (!this._hasGridCollision(pos, dims) && this._isWithinBounds(pos, dims) && dims.x <= this._maxCols && dims.y <= this._maxRows) {
				return;
			}

			this._removeFromGrid(item);

			if (this._maxCols > 0 && dims.x > this._maxCols) {
				dims.x = this._maxCols;
				item.setSize(dims);
			} else if (this._maxRows > 0 && dims.y > this._maxRows) {
				dims.y = this._maxRows;
				item.setSize(dims);
			}

			if (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims, true)) {
				var newPosition = this._fixGridPosition(pos, dims);
				item.setGridPosition(newPosition);
			}

			this._addToGrid(item);
		});
	}

	protected _calculateColWidth(): void {
		if (this._autoResize) {
			if (this._maxCols > 0 || this._visibleCols > 0) {
				var maxCols = this._maxCols > 0 ? this._maxCols : this._visibleCols;
				var maxWidth: number = this._ngEl.nativeElement.getBoundingClientRect().width;

				var colWidth: number = Math.floor(maxWidth / maxCols);
				colWidth -= (this.marginLeft + this.marginRight);
				if (colWidth > 0) this.colWidth = colWidth;

			}
		}

		if (this.colWidth < this.minWidth || this.minCols > this._config.min_cols) {
			this.minCols = Math.max(this._config.min_cols, Math.ceil(this.minWidth / this.colWidth));
		}
	}

	protected _calculateRowHeight(): void {
		if (this._autoResize) {
			if (this._maxRows > 0 || this._visibleRows > 0) {
				var maxRows = this._maxRows > 0 ? this._maxRows : this._visibleRows;
				let maxHeight: number;

				if (this._elementBasedDynamicRowHeight) {
					maxHeight = this._ngEl.nativeElement.getBoundingClientRect().height;
				} else {
					maxHeight = window.innerHeight - this.marginTop - this.marginBottom;
				}

				var rowHeight: number = Math.max(Math.floor(maxHeight / maxRows), this.minHeight);
				rowHeight -= (this.marginTop + this.marginBottom);
				if (rowHeight > 0) this.rowHeight = rowHeight;

			}
		}

		if (this.rowHeight < this.minHeight || this.minRows > this._config.min_rows) {
			this.minRows = Math.max(this._config.min_rows, Math.ceil(this.minHeight / this.rowHeight));
		}
	}

	protected _updateRatio(): void {
		if (!this._autoResize || !this._maintainRatio) return;

		if (this._maxCols > 0 && this._visibleRows <= 0) {
			this.rowHeight = this.colWidth / this._aspectRatio;
		} else if (this._maxRows > 0 && this._visibleCols <= 0) {
			this.colWidth = this._aspectRatio * this.rowHeight;
		} else if (this._maxCols == 0 && this._maxRows == 0) {
			if (this._visibleCols > 0) {
				this.rowHeight = this.colWidth / this._aspectRatio;
			} else if (this._visibleRows > 0) {
				this.colWidth = this._aspectRatio * this.rowHeight;
			}
		}
	}

	protected _applyChanges(changes: any): void {
		changes.forEachAddedItem((record: any) => { this._config[record.key] = record.currentValue; });
		changes.forEachChangedItem((record: any) => { this._config[record.key] = record.currentValue; });
		changes.forEachRemovedItem((record: any) => { delete this._config[record.key]; });

		this.setConfig(this._config);
	}

	protected _resizeStart(e: any): void {
		if (!this.resizeEnable || !this._resizingItem) return;

		//	Setup
		this._resizingItem.startMoving();
		this._removeFromGrid(this._resizingItem);
		this._createPlaceholder(this._resizingItem);

		//	Status Flags
		this.isResizing = true;
		this._resizeReady = false;

		//	Events
		this.onResizeStart.emit(this._resizingItem);
		this._resizingItem.onResizeStartEvent();
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
		const itemPos = this._resizingItem.getPosition();
		const itemDims = this._resizingItem.getDimensions();
		const endCorner = {
			left: itemPos.left + itemDims.width,
			top: itemPos.top + itemDims.height,
		}

		const resizeTop = this._resizeDirection.includes('top');
		const resizeBottom = this._resizeDirection.includes('bottom');
		const resizeLeft = this._resizeDirection.includes('left')
		const resizeRight = this._resizeDirection.includes('right');

		//	Calculate new width and height based upon resize direction
		let newW = resizeRight
			? (mousePos.left - itemPos.left + 1)
			: resizeLeft
				? (endCorner.left - mousePos.left + 1)
				: itemDims.width;
		let newH = resizeBottom
			? (mousePos.top - itemPos.top + 1)
			: resizeTop
				? (endCorner.top - mousePos.top + 1)
				: itemDims.height;

		if (newW < this.minWidth)
			newW = this.minWidth;
		if (newH < this.minHeight)
			newH = this.minHeight;
		if (newW < this._resizingItem.minWidth)
			newW = this._resizingItem.minWidth;
		if (newH < this._resizingItem.minHeight)
			newH = this._resizingItem.minHeight;

		let newX = itemPos.left;
		let newY = itemPos.top;

		if (resizeLeft)
			newX = endCorner.left - newW;
		if (resizeTop)
			newY = endCorner.top - newH;

		let calcSize = this._calculateGridSize(newW, newH);
		const itemSize = this._resizingItem.getSize();
		const iGridPos = this._resizingItem.getGridPosition();
		const bottomRightCorner = {
			col: iGridPos.col + itemSize.x,
			row: iGridPos.row + itemSize.y,
		};
		const targetPos: NgGridItemPosition = Object.assign({}, iGridPos);

		if (this._resizeDirection.includes("top"))
			targetPos.row = bottomRightCorner.row - calcSize.y;
		if (this._resizeDirection.includes("left"))
			targetPos.col = bottomRightCorner.col - calcSize.x;

		if (!this._isWithinBoundsX(targetPos, calcSize))
			calcSize = this._fixSizeToBoundsX(targetPos, calcSize);

		if (!this._isWithinBoundsY(targetPos, calcSize))
			calcSize = this._fixSizeToBoundsY(targetPos, calcSize);

		calcSize = this._resizingItem.fixSize(calcSize);

		if (calcSize.x != itemSize.x || calcSize.y != itemSize.y) {
			this._resizingItem.setGridPosition(targetPos, this._fixToGrid);
			this._placeholderRef.instance.setGridPosition(targetPos);
			this._resizingItem.setSize(calcSize, this._fixToGrid);
			this._placeholderRef.instance.setSize(calcSize);

			if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
				this._fixGridCollisions(targetPos, calcSize);
				this._cascadeGrid(targetPos, calcSize);
			}
		}

		if (!this._fixToGrid) {
			this._resizingItem.setDimensions(newW, newH);
			this._resizingItem.setPosition(newX, newY);
		}

		this.onResize.emit(this._resizingItem);
		this._resizingItem.onResizeEvent();
	}

	
	protected _resizeStop(e: any): void {
		if (!this.isResizing) return;

		this.isResizing = false;

		const itemDims = this._resizingItem.getSize();
		this._resizingItem.setSize(itemDims);

		const itemPos = this._resizingItem.getGridPosition();
		this._resizingItem.setGridPosition(itemPos);

		this._addToGrid(this._resizingItem);

		this._cascadeGrid();
		this._updateSize();

		this._resizingItem.stopMoving();
		this._resizingItem.onResizeStopEvent();
		this.onResizeStop.emit(this._resizingItem);

		this._cleanResize();
		this._placeholderRef.destroy();

		this._emitOnItemChange();
	}

	

	protected _cleanResize(): void {
		this._resizingItem = null;
		this.focusedItem = null;
		this._resizeDirection = null;
		this.isResizing = false;
		this._resizeReady = false;
	}

	protected _calculateGridSize(width: number, height: number): NgGridItemSize {
		width += this.marginLeft + this.marginRight;
		height += this.marginTop + this.marginBottom;

		var sizex = Math.max(this.minCols, Math.round(width / (this.colWidth + this.marginLeft + this.marginRight)));
		var sizey = Math.max(this.minRows, Math.round(height / (this.rowHeight + this.marginTop + this.marginBottom)));

		if (!this._isWithinBoundsX({ col: 1, row: 1 }, { x: sizex, y: sizey })) sizex = this._maxCols;
		if (!this._isWithinBoundsY({ col: 1, row: 1 }, { x: sizex, y: sizey })) sizey = this._maxRows;

		return { 'x': sizex, 'y': sizey };
	}

	
	
	
	
	protected _getAbsoluteMousePosition(e: any): NgGridRawPosition {
		if (((<any>window).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
			e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
		}

		return {
			left: e.clientX,
			top: e.clientY
		};
	}

	protected _getContainerColumns(): number {
		const maxWidth: number = this._ngEl.nativeElement.getBoundingClientRect().width;
		const itemWidth: number = this.colWidth + this.marginLeft + this.marginRight;
		return Math.floor(maxWidth / itemWidth);
	}

	protected _getContainerRows(): number {
		const maxHeight: number = window.innerHeight - this.marginTop - this.marginBottom;
		return Math.floor(maxHeight / (this.rowHeight + this.marginTop + this.marginBottom));
	}

	protected _getScreenMargin(): number {
		const maxWidth: number = this._ngEl.nativeElement.getBoundingClientRect().width;
		const itemWidth: number = this.colWidth + this.marginLeft + this.marginRight;
		return Math.floor((maxWidth - (this._maxCols * itemWidth)) / 2);;
	}

	

	

	protected _defineListeners(): void {
		const element = this._ngEl.nativeElement;

		this._documentMousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
		this._documentMouseup$ = fromEvent<MouseEvent>(document, 'mouseup');
		this._mousedown$ = fromEvent(element, 'mousedown');
		this._mousemove$ = fromEvent(element, 'mousemove');
		this._mouseup$ = fromEvent(element, 'mouseup');
		this._touchstart$ = fromEvent(element, 'touchstart');
		this._touchmove$ = fromEvent(element, 'touchmove');
		this._touchend$ = fromEvent(element, 'touchend');
	}

	protected _enableListeners(): void {
		if (this._enabledListener) {
			return;
		}

		this._enableMouseListeners();

		if (this._isTouchDevice()) {
			this._enableTouchListeners();
		}

		this._enabledListener = true;
	}

	protected _disableListeners(): void {
		this._subscriptions.forEach((subs: Subscription) => subs.unsubscribe());
		this._enabledListener = false;
	}

	protected _isTouchDevice(): boolean {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	};

	protected _enableTouchListeners(): void {
		const touchstartSubs = this._touchstart$.subscribe((e: TouchEvent) => this.mouseDownEventHandler(e));
		const touchmoveSubs = this._touchmove$.subscribe((e: TouchEvent) => this.mouseMoveEventHandler(e));
		const touchendSubs = this._touchend$.subscribe((e: TouchEvent) => this.mouseUpEventHandler(e));

		this._subscriptions.push(
			touchstartSubs,
			touchmoveSubs,
			touchendSubs
		);
	}

	protected _enableMouseListeners(): void {
		const documentMousemoveSubs = this._documentMousemove$.subscribe((e: MouseEvent) => this.mouseMoveEventHandler(e));
		const documentMouseupSubs = this._documentMouseup$.subscribe((e: MouseEvent) => this.mouseUpEventHandler(e));
		const mousedownSubs = this._mousedown$.subscribe((e: MouseEvent) => this.mouseDownEventHandler(e));
		const mousemoveSubs = this._mousemove$.subscribe((e: MouseEvent) => this.mouseMoveEventHandler(e));
		const mouseupSubs = this._mouseup$.subscribe((e: MouseEvent) => this.mouseUpEventHandler(e));

		this._subscriptions.push(
			documentMousemoveSubs,
			documentMouseupSubs,
			mousedownSubs,
			mousemoveSubs,
			mouseupSubs
		);
	}
}
