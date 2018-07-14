import { EventEmitter, Output, ViewContainerRef, Renderer2, ElementRef, KeyValueDiffers } from '@angular/core';
import { AdGridItem, AdGridItemConfig, AdGridItemEvent, GRID_ITEM_DEFAULT_CONFIG, AdGridItemDimensions, AdGridItemSize, AdGridRawPosition, AdGridItemPosition } from "../model";
import { AdGridDirective } from '../main';
import { GridDimensions } from '../model/AdGrid/GridDimensions';
export class AdGridItemDirectiveBase extends AdGridItem {

	constructor(
		protected _differs: KeyValueDiffers,
		protected _ngEl: ElementRef,
		protected _renderer: Renderer2,
		public containerRef: ViewContainerRef
	) {
		super();
	}
	public autoStyle = true;
	@Output() public onItemChange: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>(false);
	protected onMouseMove$: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	protected onNgAfterContentInit: EventEmitter<AdGridItem> = new EventEmitter<AdGridItem>();

	public getDimensions(): AdGridItemDimensions {
		return { width: this._elemWidth, height: this._elemHeight };
	}

	public getSize(): AdGridItemSize {
		return this._size;
	}

	public getPosition(): AdGridRawPosition {
		return { left: this._elemLeft, top: this._elemTop };
	}

	public getGridPosition(): AdGridItemPosition {
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
	// private _AdGrid: AdGridDirective;
	// public containerRef: ViewContainerRef;

	protected _config: AdGridItemConfig = GRID_ITEM_DEFAULT_CONFIG;
	@Output()
	public onChangeStart: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	@Output()
	public onChange: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	@Output()
	public onChangeAny: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	@Output()
	public onChangeStop: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	@Output()
	public AdGridItemChange: EventEmitter<AdGridItemConfig> = new EventEmitter<AdGridItemConfig>();
	public getEventOutput(): AdGridItemEvent {
		return <AdGridItemEvent>{
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
		this.AdGridItemChange.emit(this._userConfig);
	}

	public getElement(): ElementRef {
		return this._ngEl;
	}
	protected _recalculatePosition(gridDimensions:GridDimensions): void {
		const x: number =
			(gridDimensions.colWidth +
				gridDimensions.marginLeft +
				gridDimensions.marginRight) *
			(this._currentPosition.col - 1) +
			gridDimensions.marginLeft +
			gridDimensions.screenMargin;
		const y: number =
			(gridDimensions.rowHeight +
				gridDimensions.marginTop +
				gridDimensions.marginBottom) *
			(this._currentPosition.row - 1) +
			gridDimensions.marginTop;
			gridDimensions = null;
		this.setPosition(x, y);
	}

	protected _recalculateDimensions(gridDimensions:GridDimensions): void {
		if (this._size.x < gridDimensions.minCols)
			this._size.x = gridDimensions.minCols;
		if (this._size.y < gridDimensions.minRows)
			this._size.y = gridDimensions.minRows;

		const newWidth: number =
			gridDimensions.colWidth * this._size.x +
			(gridDimensions.marginLeft + gridDimensions.marginRight) * (this._size.x - 1);
		const newHeight: number =
			gridDimensions.rowHeight * this._size.y +
			(gridDimensions.marginTop + gridDimensions.marginBottom) * (this._size.y - 1);

		const w: number = Math.max(this.minWidth, gridDimensions.minWidth, newWidth);
		const h: number = Math.max(
			this.minHeight,
			gridDimensions.minHeight,
			newHeight
		);
		gridDimensions = null;
		this.setDimensions(w, h);
	}

	protected _getMousePosition(e: any): AdGridRawPosition {
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

		const refPos: AdGridRawPosition = this._ngEl.nativeElement.getBoundingClientRect();

		return {
			left: e.clientX - refPos.left,
			top: e.clientY - refPos.top
		};
	}
	public fixSize(newSize: AdGridItemSize, gridDimensions:GridDimensions): AdGridItemSize {
		if (this._maxCols > 0 && newSize.x > this._maxCols)
			newSize.x = this._maxCols;
		if (this._maxRows > 0 && newSize.y > this._maxRows)
			newSize.y = this._maxRows;

		if (this._minCols > 0 && newSize.x < this._minCols)
			newSize.x = this._minCols;
		if (this._minRows > 0 && newSize.y < this._minRows)
			newSize.y = this._minRows;

		const itemWidth =
			newSize.x * gridDimensions.colWidth +
			(gridDimensions.marginLeft + gridDimensions.marginRight) * (newSize.x - 1);
		if (itemWidth < this.minWidth)
			newSize.x = Math.ceil(
				(this.minWidth + gridDimensions.marginRight + gridDimensions.marginLeft) /
				(gridDimensions.colWidth +
					gridDimensions.marginRight +
					gridDimensions.marginLeft)
			);

		const itemHeight =
			newSize.y * gridDimensions.rowHeight +
			(gridDimensions.marginTop + gridDimensions.marginBottom) * (newSize.y - 1);
		if (itemHeight < this.minHeight)
			newSize.y = Math.ceil(
				(this.minHeight + gridDimensions.marginBottom + gridDimensions.marginTop) /
				(gridDimensions.rowHeight +
					gridDimensions.marginBottom +
					gridDimensions.marginTop)
			);
		gridDimensions = null;
		return newSize;
	}
	public setSize(newSize: AdGridItemSize, gridDimensions:GridDimensions): void {
		newSize = this.fixSize(newSize, gridDimensions);
		this._size = newSize;
		this.onItemChange.emit(this.getEventOutput());
		gridDimensions = null;
	}
	public updateDimensions(gridDimensions:GridDimensions){

		this._recalculateDimensions(gridDimensions);
		gridDimensions = null;
	}
	public updatePosition(gridDimensions:GridDimensions){

		this._recalculatePosition(gridDimensions);
		gridDimensions = null;
	}
	public setGridPosition( gridPosition: AdGridItemPosition): void {
		this._currentPosition = gridPosition;
		this.onItemChange.emit(this.getEventOutput());
	}
	public setItemActiveOn(): void {
		this._renderer.addClass(this._ngEl.nativeElement, "ad-grid-item-active");
		const style: any = window.getComputedStyle(this._ngEl.nativeElement);
		if (this.autoStyle)
			this._renderer.setStyle(
				this._ngEl.nativeElement,
				"z-index",
				(parseInt(style.getPropertyValue("z-index")) + 1).toString()
			);
	}

	public setItemActiveOff(): void {
		this._renderer.removeClass(this._ngEl.nativeElement, "ad-grid-item-active");
		const style: any = window.getComputedStyle(this._ngEl.nativeElement);
		if (this.autoStyle)
			this._renderer.setStyle(
				this._ngEl.nativeElement,
				"z-index",
				(parseInt(style.getPropertyValue("z-index")) - 1).toString()
			);
	}



	public recalculateSelf(gridDimensions:GridDimensions): void {
		this._recalculatePosition(gridDimensions);
		this._recalculateDimensions(gridDimensions);
		gridDimensions = null;
	}



}