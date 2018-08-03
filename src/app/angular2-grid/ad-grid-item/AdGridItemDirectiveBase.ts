import { EventEmitter, ViewContainerRef, Renderer2, ElementRef, KeyValueDiffers } from '@angular/core';
import { AdGridItem, AdGridItemEvent, AdGridItemRawPosition} from "../model";
import { GridDimensions } from '../model/AdGrid/GridDimensions';
import { AdGridItemDirectiveBaseDimesionsMixin } from './AdGridItemDirectiveBaseDimensionMixin';
import { AdGridItemDirectiveBasePositionMixin } from './AdGridItemDirectiveBasePositionMixin';

let TheMixins = AdGridItemDirectiveBaseDimesionsMixin(AdGridItemDirectiveBasePositionMixin(AdGridItem));

export class AdGridItemDirectiveBase extends TheMixins {

	constructor(
		protected _differs: KeyValueDiffers,
		protected _ngEl: ElementRef,
		protected _renderer: Renderer2,
		public containerRef: ViewContainerRef
	) {
		super();
	} 
	public autoStyle = true;
	protected onMouseMove$: EventEmitter<AdGridItemEvent> = new EventEmitter<AdGridItemEvent>();
	protected onNgAfterContentInit: EventEmitter<AdGridItem> = new EventEmitter<AdGridItem>();
	protected itemRecalculationAsNeed: EventEmitter<AdGridItem> = new EventEmitter<AdGridItem>();
	
	protected elementAdjustmentAsNeed: EventEmitter<AdGridItem> = new EventEmitter<AdGridItem>();
	

	
//warning split out
	public setCascadeMode(cascade: string): void {
		this._cascadeMode = cascade;
		// switch (cascade) {
		// 	case "up":
		// 	case "left":
		// 	default:
		// 		this._renderer.setStyle(
		// 			this._ngEl.nativeElement,
		// 			"left",
		// 			this._elemLeft + "px"
		// 		);
		// 		this._renderer.setStyle(
		// 			this._ngEl.nativeElement,
		// 			"top",
		// 			this._elemTop + "px"
		// 		);
		// 		this._renderer.setStyle(this._ngEl.nativeElement, "right", null);
		// 		this._renderer.setStyle(this._ngEl.nativeElement, "bottom", null);
		// 		break;
		// 	case "right":
		// 		this._renderer.setStyle(
		// 			this._ngEl.nativeElement,
		// 			"right",
		// 			this._elemLeft + "px"
		// 		);
		// 		this._renderer.setStyle(
		// 			this._ngEl.nativeElement,
		// 			"top",
		// 			this._elemTop + "px"
		// 		);
		// 		this._renderer.setStyle(this._ngEl.nativeElement, "left", null);
		// 		this._renderer.setStyle(this._ngEl.nativeElement, "bottom", null);
		// 		break;
		// 	case "down":
		// 		this._renderer.setStyle(
		// 			this._ngEl.nativeElement,
		// 			"left",
		// 			this._elemLeft + "px"
		// 		);
		// 		this._renderer.setStyle(
		// 			this._ngEl.nativeElement,
		// 			"bottom",
		// 			this._elemTop + "px"
		// 		);
		// 		this._renderer.setStyle(this._ngEl.nativeElement, "right", null);
		// 		this._renderer.setStyle(this._ngEl.nativeElement, "top", null);
		// 		break;
		// }
	}
	
	


	// private _differs: KeyValueDiffers;
	// private _ngEl: ElementRef;
	// private _renderer: Renderer2;
	// private _AdGrid: AdGridDirective;
	// public containerRef: ViewContainerRef;

	protected onConfigChangeEvent() {
		if (this._userConfig === null)
			return;
		this._config.sizex = this._userConfig.sizex = this._itemGridDimension.col;
		this._config.sizey = this._userConfig.sizey = this._itemGridDimension.row;
		this._config.col = this._userConfig.col = this._currentGridPosition.col;
		this._config.row = this._userConfig.row = this._currentGridPosition.row;
		this.AdGridItemChange.emit(this._userConfig);
	}

	public getElement(): ElementRef {
		return this._ngEl;
	}
	
	public onItemCalculationNeeded(){
		this.itemRecalculationAsNeed.emit(this);
	}
	public onElementAdjustmentNeeded(){
		this.elementAdjustmentAsNeed.emit(this);
	}
	
	
	

	// public moveElementToGridPosition(gridDimensions:GridDimensions): void {
	// 	// const x: number =
	// 	// 	(gridDimensions.colWidth +
	// 	// 		gridDimensions.marginLeft +
	// 	// 		gridDimensions.marginRight) *
	// 	// 	(this._currentGridPosition.col - 1) +
	// 	// 	gridDimensions.marginLeft +
	// 	// 	gridDimensions.screenMargin;
	// 	// const y: number =
	// 	// 	(gridDimensions.rowHeight +
	// 	// 		gridDimensions.marginTop +
	// 	// 		gridDimensions.marginBottom) *
	// 	// 	(this._currentGridPosition.row - 1) +
	// 	// 	gridDimensions.marginTop;
	// 	// 	gridDimensions = null;

	// 	const{x, y}	= this.calculateElementPositionByGrid(gridDimensions);
	// 	this.moveElementPosition(x, y);
	// }

	
	
	
	// public updateDimensions(gridDimensions:GridDimensions){

	// 	this._recalculateDimensions(gridDimensions);
	// 	gridDimensions = null;
	// }
	// public updatePosition(gridDimensions:GridDimensions){

	// 	this._recalculatePosition(gridDimensions);
	// 	gridDimensions = null;
	// }
	
	// public recalculateSelfAsNeeded(gridDimensions:GridDimensions){
	// 	this.recalculateGridPositionAsNeeded(gridDimensions);
	// 	this.recalculateGridDimensionsAsNeeded(gridDimensions);
	// 	gridDimensions = null;
	// }

	
	
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


	
	protected _getMousePosition(e: any): AdGridItemRawPosition {
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

		const refPos: AdGridItemRawPosition = this._ngEl.nativeElement.getBoundingClientRect();

		return {
			x: e.clientX - refPos.x,
			y: e.clientY - refPos.y
		};
	}
	








}