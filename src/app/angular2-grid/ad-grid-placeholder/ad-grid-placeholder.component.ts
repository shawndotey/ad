import { Component, ElementRef, Renderer, OnInit } from '@angular/core';
import { AdGridDirective } from '../ad-grid/ad-grid.directive';
import { AdGridDirectiveBase } from "../ad-grid/AdGridDirectiveBase";
import { GridDimensions } from "../model/AdGrid/GridDimensions";
import { AdGridItemGridPosition, AdGridItemGridDimension } from "../model";

@Component({
	selector: 'ad-grid-placeholder',
	template: ''
})
export class AdGridPlaceholderComponent implements OnInit {
	private _size: AdGridItemGridDimension;
	private _position: AdGridItemGridPosition;
	private _AdGrid: AdGridDirective | AdGridDirectiveBase;
	private _cascadeMode: string;
	autoStyle = true;
	constructor(private _ngEl: ElementRef, private _renderer: Renderer) { }

	

	public ngOnInit(): void {
		this._renderer.setElementClass(this._ngEl.nativeElement, 'grid-placeholder', true);
		if (this.autoStyle) this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'absolute');
	}

	public setSize(newSize: AdGridItemGridDimension, gridDimensions:GridDimensions): void {
		this._size = newSize;
		this._recalculateDimensions(gridDimensions);
		gridDimensions= null;
	}

	public setGridPosition(newPosition: AdGridItemGridPosition, gridDimensions:GridDimensions): void {
		this._position = newPosition;
		this._recalculatePosition(gridDimensions);
		gridDimensions= null;
	}

	public setCascadeMode(cascade: string): void {
		this._cascadeMode = cascade;
		switch (cascade) {
			case 'up':
			case 'left':
			default:
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', null);
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', null);
				break;
			case 'right':
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', null);
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', null);
				break;
			case 'down':
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', null);
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', null);
				break;
		}
	}

	//	Private methods
	private _setDimensions(w: number, h: number): void {
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', w + 'px');
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', h + 'px');
	}

	private _setPosition(x: number, y: number): void {
		switch (this._cascadeMode) {
			case 'up':
			case 'left':
			default:
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + x + 'px, ' + y + 'px)');
				break;
			case 'right':
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + -x + 'px, ' + y + 'px)');
				break;
			case 'down':
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + x + 'px, ' + -y + 'px)');
				break;
		}
	}

	private _recalculatePosition(gridDimensions:GridDimensions): void {
		const x: number = (gridDimensions.colWidth + gridDimensions.marginLeft + gridDimensions.marginRight) * (this._position.col - 1) + gridDimensions.marginLeft + gridDimensions.screenMargin;
		const y: number = (gridDimensions.rowHeight + gridDimensions.marginTop + gridDimensions.marginBottom) * (this._position.row - 1) + gridDimensions.marginTop;
		this._setPosition(x, y);
		gridDimensions = null;
	}

	private _recalculateDimensions(gridDimensions:GridDimensions): void {
		const w: number = (gridDimensions.colWidth * this._size.col) + ((gridDimensions.marginLeft + gridDimensions.marginRight) * (this._size.col - 1));
		const h: number = (gridDimensions.rowHeight * this._size.row) + ((gridDimensions.marginTop + gridDimensions.marginBottom) * (this._size.row - 1));
		this._setDimensions(w, h);
		gridDimensions = null;
	}
}
