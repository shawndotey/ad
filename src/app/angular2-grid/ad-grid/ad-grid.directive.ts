import { AdGridDirectiveWithMixins } from "./AdGridDirectiveWithMixins";
import { Directive, ElementRef, Renderer, EventEmitter, ComponentFactoryResolver, KeyValueDiffers, OnInit, OnDestroy, DoCheck, Output } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { AdGridItemSize } from "../model/AdGridItem/AdGridItemSize";
import { AdGridItemPosition } from "../model/AdGridItem/AdGridItemPosition";
import { AdGridRawPosition } from "../model/AdGrid/AdGridRawPosition";
import { AdConfigFixDirection } from "../model/AdConfigFixDirection";
import { AdGridConfig } from "../model/AdGrid/AdGridConfig";
import { AdGridItemDirective } from '../ad-grid-item/ad-grid-item.directive';
import * as AdGridHelper from "../shared/AdGridHelpers";

@Directive({
	selector: '[adGrid]',
	inputs: ['config: adGrid'],
	host: {
		'(window:resize)': 'resizeEventHandler($event)',
	}
})
export class AdGridDirective extends AdGridDirectiveWithMixins implements OnInit, DoCheck, OnDestroy {
	//_draggingItem: AdGridItemDirective;

	ngAfterContentInit(): void {
		
		
		
		this.onNgAfterContentInit.emit();
		this.registerGridItems();
	}
	protected registerGridItems() {
		// need to make reactive
		this.gridItems.forEach(gridItem=>{

			gridItem.autoStyle = this.autoStyle;
			this.addItem(gridItem);
			this.updateItem(gridItem);
			gridItem.fixSize(gridItem.getSize(), this.gridDimensions)
			gridItem.recalculateSelf(this.gridDimensions)
		
			gridItem = null;

		})

	}

	


	//	Event Emitters
	@Output() public onResizeStart: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();
	@Output() public onResize: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();
	@Output() public onResizeStop: EventEmitter<AdGridItemDirective> = new EventEmitter<AdGridItemDirective>();
	
	
	
	
	protected _config = AdGridDirective.CONST_DEFAULT_CONFIG;

	//	[ad-grid] attribute handler
	set config(v: AdGridConfig) {
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
		const uid: string = AdGridHelper.generateUuid();

		if (this._items.has(uid)) {
			return this.generateItemUid();
		}

		return uid;
	}

	public setConfig(config: AdGridConfig): void {
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
					this.gridDimensions.colWidth = Math.max(intVal, 1);
					break;
				case 'row_height':
					this.gridDimensions.rowHeight = Math.max(intVal, 1);
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
					this.gridDimensions.minRows = Math.max(intVal, 1);
					break;
				case 'min_cols':
					this.gridDimensions.minCols = Math.max(intVal, 1);
					break;
				case 'min_height':
					this.gridDimensions.minHeight = Math.max(intVal, 1);
					break;
				case 'min_width':
					this.gridDimensions.minWidth = Math.max(intVal, 1);
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
			this.gridDimensions.screenMargin = this._getScreenMargin();
		} else {
			this.gridDimensions.screenMargin = 0;
		}

		if (this._maintainRatio) {
			if (this.gridDimensions.colWidth && this.gridDimensions.rowHeight) {
				this._aspectRatio = this.gridDimensions.colWidth / this.gridDimensions.rowHeight;
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

		var maxWidth = this._maxCols * this.gridDimensions.colWidth;
		var maxHeight = this._maxRows * this.gridDimensions.rowHeight;

		if (maxWidth > 0 && this.gridDimensions.minWidth > maxWidth) this.gridDimensions.minWidth = 0.75 * this.gridDimensions.colWidth;
		if (maxHeight > 0 && this.gridDimensions.minHeight > maxHeight) this.gridDimensions.minHeight = 0.75 * this.gridDimensions.rowHeight;

		if (this.gridDimensions.minWidth > this.gridDimensions.colWidth) this.gridDimensions.minCols = Math.max(this.gridDimensions.minCols, Math.ceil(this.gridDimensions.minWidth / this.gridDimensions.colWidth));
		if (this.gridDimensions.minHeight > this.gridDimensions.rowHeight) this.gridDimensions.minRows = Math.max(this.gridDimensions.minRows, Math.ceil(this.gridDimensions.minHeight / this.gridDimensions.rowHeight));

		if (this._maxCols > 0 && this.gridDimensions.minCols > this._maxCols) this.gridDimensions.minCols = 1;
		if (this._maxRows > 0 && this.gridDimensions.minRows > this._maxRows) this.gridDimensions.minRows = 1;

		this._updateRatio();

		this._items.forEach((item: AdGridItemDirective) => {
			this._removeFromGrid(item);
			item.setCascadeMode(this.cascade);
		});

		this._items.forEach((item: AdGridItemDirective) => {
			item.recalculateSelf(this.gridDimensions);
			this._addToGrid(item);
		});

		this._cascadeGrid();
		this._updateSize();
	}

	public getItemPosition(itemId: string): AdGridItemPosition {
		return this._items.has(itemId) ? this._items.get(itemId).getGridPosition() : null;
	}

	public getItemSize(itemId: string): AdGridItemSize {
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
		this.gridDimensions.marginTop = Math.max(parseInt(margins[0]), 0);
		this.gridDimensions.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1]), 0) : this.gridDimensions.marginTop;
		this.gridDimensions.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.gridDimensions.marginTop;
		this.gridDimensions.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3]), 0) : this.gridDimensions.marginRight;
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
	
	public addItem(ngItem: AdGridItemDirective): void {
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
			ngItem.recalculateSelf(this.gridDimensions);
			ngItem.onCascadeEvent();

			this._emitOnItemChange();
		});

	}

	public removeItem(ngItem: AdGridItemDirective): void {
		this._removeFromGrid(ngItem);

		this._items.delete(ngItem.uid);

		if (this._destroyed) return;

		this.triggerCascade().then(() => {
			this._updateSize();
			this._items.forEach((item: AdGridItemDirective) => item.recalculateSelf(this.gridDimensions));
			this._emitOnItemChange();
		});
	}

	public updateItem(ngItem: AdGridItemDirective): void {
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
		this.resizeEventHandler();
	}

	public resizeEventHandler(): void {
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
				this.gridDimensions.screenMargin = this._getScreenMargin();

				this._items.forEach((item: AdGridItemDirective) => {
					item.recalculateSelf(this.gridDimensions);
				});
			}
		} else if (this._autoResize) {
			this._items.forEach((item: AdGridItemDirective) => {
				item.recalculateSelf(this.gridDimensions);
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
			this.focusedItem = item;
			this._resizeDirection = resizeDirection;

			e.preventDefault();
		} 
		
	}

	public mouseUpEventHandler(e: MouseEvent | TouchEvent): void {
		// if (this.isDragging) {
		// 	this._dragStop(e);
		// } else 
		if (this.isResizing) {
			this._resizeStop();
		} else if ( this._resizeReady) {
			// this._cleanDrag();
			this._cleanResize();
		}
	}

	public mouseMoveEventHandler(e: MouseEvent | TouchEvent): void {
		// console.log('mouseMoveEventHandler')
		if (this._resizeReady) {
			this._resizeStart();
			e.preventDefault();
			return;
		} 
		
		if (this.isResizing) {
			this._resize(e);
		} else {
			var mousePos = this._getMousePosition(e);
			var item = this._getItemFromPosition(mousePos);

			if (item) {
				item.onMouseMove(e, this.resizeEnable);
			}
		}
	}

	//	protected methods
	protected _getFixDirectionFromCascade(): AdConfigFixDirection {
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
		this._items.forEach((item: AdGridItemDirective) => {
			var pos = item.getGridPosition();
			var dims = item.getSize();

			if (!this._hasGridCollision(pos, dims) && this._isWithinBounds(pos, dims) && dims.x <= this._maxCols && dims.y <= this._maxRows) {
				return;
			}

			this._removeFromGrid(item);

			if (this._maxCols > 0 && dims.x > this._maxCols) {
				dims.x = this._maxCols;
				item.setSize(dims, this.gridDimensions);
			} else if (this._maxRows > 0 && dims.y > this._maxRows) {
				dims.y = this._maxRows;
				item.setSize(dims, this.gridDimensions);
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
				colWidth -= (this.gridDimensions.marginLeft + this.gridDimensions.marginRight);
				if (colWidth > 0) this.gridDimensions.colWidth = colWidth;

			}
		}

		if (this.gridDimensions.colWidth < this.gridDimensions.minWidth || this.gridDimensions.minCols > this._config.min_cols) {
			this.gridDimensions.minCols = Math.max(this._config.min_cols, Math.ceil(this.gridDimensions.minWidth / this.gridDimensions.colWidth));
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
					maxHeight = window.innerHeight - this.gridDimensions.marginTop - this.gridDimensions.marginBottom;
				}

				var rowHeight: number = Math.max(Math.floor(maxHeight / maxRows), this.gridDimensions.minHeight);
				rowHeight -= (this.gridDimensions.marginTop + this.gridDimensions.marginBottom);
				if (rowHeight > 0) this.gridDimensions.rowHeight = rowHeight;

			}
		}

		if (this.gridDimensions.rowHeight < this.gridDimensions.minHeight || this.gridDimensions.minRows > this._config.min_rows) {
			this.gridDimensions.minRows = Math.max(this._config.min_rows, Math.ceil(this.gridDimensions.minHeight / this.gridDimensions.rowHeight));
		}
	}

	protected _updateRatio(): void {
		if (!this._autoResize || !this._maintainRatio) return;

		if (this._maxCols > 0 && this._visibleRows <= 0) {
			this.gridDimensions.rowHeight = this.gridDimensions.colWidth / this._aspectRatio;
		} else if (this._maxRows > 0 && this._visibleCols <= 0) {
			this.gridDimensions.colWidth = this._aspectRatio * this.gridDimensions.rowHeight;
		} else if (this._maxCols == 0 && this._maxRows == 0) {
			if (this._visibleCols > 0) {
				this.gridDimensions.rowHeight = this.gridDimensions.colWidth / this._aspectRatio;
			} else if (this._visibleRows > 0) {
				this.gridDimensions.colWidth = this._aspectRatio * this.gridDimensions.rowHeight;
			}
		}
	}

	protected _applyChanges(changes: any): void {
		changes.forEachAddedItem((record: any) => { this._config[record.key] = record.currentValue; });
		changes.forEachChangedItem((record: any) => { this._config[record.key] = record.currentValue; });
		changes.forEachRemovedItem((record: any) => { delete this._config[record.key]; });

		this.setConfig(this._config);
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
		const itemPos = this.focusedItem.getPosition();
		const itemDims = this.focusedItem.getDimensions();
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

		if (newW < this.gridDimensions.minWidth)
			newW = this.gridDimensions.minWidth;
		if (newH < this.gridDimensions.minHeight)
			newH = this.gridDimensions.minHeight;
		if (newW < this.focusedItem.minWidth)
			newW = this.focusedItem.minWidth;
		if (newH < this.focusedItem.minHeight)
			newH = this.focusedItem.minHeight;

		let newX = itemPos.left;
		let newY = itemPos.top;

		if (resizeLeft)
			newX = endCorner.left - newW;
		if (resizeTop)
			newY = endCorner.top - newH;

		let calcSize = this._calculateGridSize(newW, newH);
		const itemSize = this.focusedItem.getSize();
		const iGridPos = this.focusedItem.getGridPosition();
		const bottomRightCorner = {
			col: iGridPos.col + itemSize.x,
			row: iGridPos.row + itemSize.y,
		};
		const targetPos: AdGridItemPosition = Object.assign({}, iGridPos);

		if (this._resizeDirection.includes("top"))
			targetPos.row = bottomRightCorner.row - calcSize.y;
		if (this._resizeDirection.includes("left"))
			targetPos.col = bottomRightCorner.col - calcSize.x;

		if (!this._isWithinBoundsX(targetPos, calcSize))
			calcSize = this._fixSizeToBoundsX(targetPos, calcSize);

		if (!this._isWithinBoundsY(targetPos, calcSize))
			calcSize = this._fixSizeToBoundsY(targetPos, calcSize);

		calcSize = this.focusedItem.fixSize(calcSize, this.gridDimensions);

		if (calcSize.x != itemSize.x || calcSize.y != itemSize.y) {
			this.focusedItem.setGridPosition(targetPos);
			if(this._fixToGrid){
				this.focusedItem.updateDimensions(this.gridDimensions)
			}

			this._placeholderRef.instance.setGridPosition(targetPos, this.gridDimensions);
			this.focusedItem.setSize(calcSize,this.gridDimensions );
			if(this._fixToGrid){
				this.focusedItem.updateDimensions(this.gridDimensions)
			}
			this._placeholderRef.instance.setSize(calcSize, this.gridDimensions);

			if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
				this._fixGridCollisions(targetPos, calcSize);
				this._cascadeGrid(targetPos, calcSize);
			}
		}

		if (!this._fixToGrid) {
			this.focusedItem.setDimensions(newW, newH);
			this.focusedItem.setPosition(newX, newY);
		}

		this.onResize.emit(this.focusedItem);
		this.focusedItem.onResizeEvent();
	}

	
	protected _resizeStop(): void {
		if (!this.isResizing) return;

		this.isResizing = false;

		const itemDims = this.focusedItem.getSize();
		this.focusedItem.setSize(itemDims, this.gridDimensions);

		const itemPos = this.focusedItem.getGridPosition();
		this.focusedItem.setGridPosition(itemPos);

		this._addToGrid(this.focusedItem);

		this._cascadeGrid();
		this._updateSize();

		this.focusedItem.setItemActiveOff();
		this.focusedItem.onResizeStopEvent();
		this.onResizeStop.emit(this.focusedItem);

		this._cleanResize();
		this._placeholderRef.destroy();

		this._emitOnItemChange();
	}

	

	protected _cleanResize(): void {
		this.focusedItem = null;
		this.focusedItem = null;
		this._resizeDirection = null;
		this.isResizing = false;
		this._resizeReady = false;
	}

	protected _calculateGridSize(width: number, height: number): AdGridItemSize {
		width += this.gridDimensions.marginLeft + this.gridDimensions.marginRight;
		height += this.gridDimensions.marginTop + this.gridDimensions.marginBottom;

		var sizex = Math.max(this.gridDimensions.minCols, Math.round(width / (this.gridDimensions.colWidth + this.gridDimensions.marginLeft + this.gridDimensions.marginRight)));
		var sizey = Math.max(this.gridDimensions.minRows, Math.round(height / (this.gridDimensions.rowHeight + this.gridDimensions.marginTop + this.gridDimensions.marginBottom)));

		if (!this._isWithinBoundsX({ col: 1, row: 1 }, { x: sizex, y: sizey })) sizex = this._maxCols;
		if (!this._isWithinBoundsY({ col: 1, row: 1 }, { x: sizex, y: sizey })) sizey = this._maxRows;

		return { 'x': sizex, 'y': sizey };
	}

	
	
	
	
	protected _getAbsoluteMousePosition(e: any): AdGridRawPosition {
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
		const itemWidth: number = this.gridDimensions.colWidth + this.gridDimensions.marginLeft + this.gridDimensions.marginRight;
		return Math.floor(maxWidth / itemWidth);
	}

	protected _getContainerRows(): number {
		const maxHeight: number = window.innerHeight - this.gridDimensions.marginTop - this.gridDimensions.marginBottom;
		return Math.floor(maxHeight / (this.gridDimensions.rowHeight + this.gridDimensions.marginTop + this.gridDimensions.marginBottom));
	}

	protected _getScreenMargin(): number {
		const maxWidth: number = this._ngEl.nativeElement.getBoundingClientRect().width;
		const itemWidth: number = this.gridDimensions.colWidth + this.gridDimensions.marginLeft + this.gridDimensions.marginRight;
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
