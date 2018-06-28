import { EventEmitter, Output, ViewContainerRef, Renderer2, ElementRef, KeyValueDiffers } from '@angular/core';
import { NgGridItem, NgGridItemConfig, NgGridItemEvent, GRID_ITEM_DEFAULT_CONFIG, NgGridItemDimensions, NgGridItemSize, NgGridRawPosition, NgGridItemPosition } from "../model";
import { NgGridDirective } from '../main';
export class NgGridItemDirectiveBase extends NgGridItem {
	
	constructor(
		protected _differs: KeyValueDiffers,
		protected _ngEl: ElementRef,
		protected _renderer: Renderer2,
		protected _ngGrid: NgGridDirective,
		public containerRef: ViewContainerRef
	  ) {
		super();
		
	  }
	  @Output()
	  public onItemChange: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>(false);
	
	  public getDimensions(): NgGridItemDimensions {
		return { width: this._elemWidth, height: this._elemHeight };
	  }
	
	  public getSize(): NgGridItemSize {
		return this._size;
	  }
	
	  public getPosition(): NgGridRawPosition {
		return { left: this._elemLeft, top: this._elemTop };
	  }
	
	  public getGridPosition(): NgGridItemPosition {
		return this._currentPosition;
	  }
	  public setPosition(x: number, y: number): void {
		switch (this._cascadeMode) {
		  case "up":
		  case "left":
		  default:
			this._renderer.setStyle(this._ngEl.nativeElement, "left", x + "px");
			this._renderer.setStyle(this._ngEl.nativeElement, "top", y + "px");
			break;
		  case "right":
			this._renderer.setStyle(this._ngEl.nativeElement, "right", x + "px");
			this._renderer.setStyle(this._ngEl.nativeElement, "top", y + "px");
			break;
		  case "down":
			this._renderer.setStyle(this._ngEl.nativeElement, "left", x + "px");
			this._renderer.setStyle(this._ngEl.nativeElement, "bottom", y + "px");
			break;
		}
	
		this._elemLeft = x;
		this._elemTop = y;
	  }
	
	  public setCascadeMode(cascade: string): void {
		this._cascadeMode = cascade;
		switch (cascade) {
		  case "up":
		  case "left":
		  default:
			this._renderer.setStyle(
			  this._ngEl.nativeElement,
			  "left",
			  this._elemLeft + "px"
			);
			this._renderer.setStyle(
			  this._ngEl.nativeElement,
			  "top",
			  this._elemTop + "px"
			);
			this._renderer.setStyle(this._ngEl.nativeElement, "right", null);
			this._renderer.setStyle(this._ngEl.nativeElement, "bottom", null);
			break;
		  case "right":
			this._renderer.setStyle(
			  this._ngEl.nativeElement,
			  "right",
			  this._elemLeft + "px"
			);
			this._renderer.setStyle(
			  this._ngEl.nativeElement,
			  "top",
			  this._elemTop + "px"
			);
			this._renderer.setStyle(this._ngEl.nativeElement, "left", null);
			this._renderer.setStyle(this._ngEl.nativeElement, "bottom", null);
			break;
		  case "down":
			this._renderer.setStyle(
			  this._ngEl.nativeElement,
			  "left",
			  this._elemLeft + "px"
			);
			this._renderer.setStyle(
			  this._ngEl.nativeElement,
			  "bottom",
			  this._elemTop + "px"
			);
			this._renderer.setStyle(this._ngEl.nativeElement, "right", null);
			this._renderer.setStyle(this._ngEl.nativeElement, "top", null);
			break;
		}
	  }
	
	  public setDimensions(w: number, h: number): void {
		if (w < this.minWidth) w = this.minWidth;
		if (h < this.minHeight) h = this.minHeight;
	
		this._renderer.setStyle(this._ngEl.nativeElement, "width", w + "px");
		this._renderer.setStyle(this._ngEl.nativeElement, "height", h + "px");
	
		this._elemWidth = w;
		this._elemHeight = h;
	  }
	// private _differs: KeyValueDiffers;
	// private _ngEl: ElementRef;
	// private _renderer: Renderer2;
	// private _ngGrid: NgGridDirective;
	// public containerRef: ViewContainerRef;
	
	protected _config: NgGridItemConfig = GRID_ITEM_DEFAULT_CONFIG;
	@Output()
	public onChangeStart: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onChange: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onChangeAny: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public onChangeStop: EventEmitter<NgGridItemEvent> = new EventEmitter<NgGridItemEvent>();
	@Output()
	public ngGridItemChange: EventEmitter<NgGridItemConfig> = new EventEmitter<NgGridItemConfig>();
	public getEventOutput(): NgGridItemEvent {
		return <NgGridItemEvent>{
			uid: this.uid,
			payload: this._payload,
			col: this._currentPosition.col,
			row: this._currentPosition.row,
			sizex: this._size.x,
			sizey: this._size.y,
			width: this._elemWidth,
			height: this._elemHeight,
			left: this._elemLeft,
			top: this._elemTop
		};
	}
	protected onConfigChangeEvent() {
		if (this._userConfig === null)
			return;
		this._config.sizex = this._userConfig.sizex = this._size.x;
		this._config.sizey = this._userConfig.sizey = this._size.y;
		this._config.col = this._userConfig.col = this._currentPosition.col;
		this._config.row = this._userConfig.row = this._currentPosition.row;
		this.ngGridItemChange.emit(this._userConfig);
	}

	public getElement(): ElementRef {
		return this._ngEl;
	  }
	  protected _recalculatePosition(): void {
		const x: number =
		  (this._ngGrid.colWidth +
			this._ngGrid.marginLeft +
			this._ngGrid.marginRight) *
			(this._currentPosition.col - 1) +
		  this._ngGrid.marginLeft +
		  this._ngGrid.screenMargin;
		const y: number =
		  (this._ngGrid.rowHeight +
			this._ngGrid.marginTop +
			this._ngGrid.marginBottom) *
			(this._currentPosition.row - 1) +
		  this._ngGrid.marginTop;
	
		this.setPosition(x, y);
	  }
	
	  protected _recalculateDimensions(): void {
		if (this._size.x < this._ngGrid.minCols)
		  this._size.x = this._ngGrid.minCols;
		if (this._size.y < this._ngGrid.minRows)
		  this._size.y = this._ngGrid.minRows;
	
		const newWidth: number =
		  this._ngGrid.colWidth * this._size.x +
		  (this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._size.x - 1);
		const newHeight: number =
		  this._ngGrid.rowHeight * this._size.y +
		  (this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._size.y - 1);
	
		const w: number = Math.max(this.minWidth, this._ngGrid.minWidth, newWidth);
		const h: number = Math.max(
		  this.minHeight,
		  this._ngGrid.minHeight,
		  newHeight
		);
	
		this.setDimensions(w, h);
	  }
	
	  protected _getMousePosition(e: any): NgGridRawPosition {
		if (e.originalEvent && e.originalEvent.touches) {
		  const oe: any = e.originalEvent;
		  e = oe.touches.length
			? oe.touches[0]
			: oe.changedTouches.length
			  ? oe.changedTouches[0]
			  : e;
		} else if (e.touches) {
		  e = e.touches.length
			? e.touches[0]
			: e.changedTouches.length
			  ? e.changedTouches[0]
			  : e;
		}
	
		const refPos: NgGridRawPosition = this._ngEl.nativeElement.getBoundingClientRect();
	
		return {
		  left: e.clientX - refPos.left,
		  top: e.clientY - refPos.top
		};
	  }
	  public fixSize(newSize: NgGridItemSize): NgGridItemSize {
		if (this._maxCols > 0 && newSize.x > this._maxCols)
		  newSize.x = this._maxCols;
		if (this._maxRows > 0 && newSize.y > this._maxRows)
		  newSize.y = this._maxRows;
	
		if (this._minCols > 0 && newSize.x < this._minCols)
		  newSize.x = this._minCols;
		if (this._minRows > 0 && newSize.y < this._minRows)
		  newSize.y = this._minRows;
	
		const itemWidth =
		  newSize.x * this._ngGrid.colWidth +
		  (this._ngGrid.marginLeft + this._ngGrid.marginRight) * (newSize.x - 1);
		if (itemWidth < this.minWidth)
		  newSize.x = Math.ceil(
			(this.minWidth + this._ngGrid.marginRight + this._ngGrid.marginLeft) /
			  (this._ngGrid.colWidth +
				this._ngGrid.marginRight +
				this._ngGrid.marginLeft)
		  );
	
		const itemHeight =
		  newSize.y * this._ngGrid.rowHeight +
		  (this._ngGrid.marginTop + this._ngGrid.marginBottom) * (newSize.y - 1);
		if (itemHeight < this.minHeight)
		  newSize.y = Math.ceil(
			(this.minHeight + this._ngGrid.marginBottom + this._ngGrid.marginTop) /
			  (this._ngGrid.rowHeight +
				this._ngGrid.marginBottom +
				this._ngGrid.marginTop)
		  );
	
		return newSize;
	  }
	  public setSize(newSize: NgGridItemSize, update: boolean = true): void {
		newSize = this.fixSize(newSize);
		this._size = newSize;
		if (update) this._recalculateDimensions();
	
		this.onItemChange.emit(this.getEventOutput());
	  }
	  public setGridPosition(
		gridPosition: NgGridItemPosition,
		update: boolean = true
	  ): void {
		this._currentPosition = gridPosition;
		if (update) this._recalculatePosition();
	
		this.onItemChange.emit(this.getEventOutput());
	  }
	
	 
	
	
	  public recalculateSelf(): void {
		this._recalculatePosition();
		this._recalculateDimensions();
	  }
	
	 
	
}