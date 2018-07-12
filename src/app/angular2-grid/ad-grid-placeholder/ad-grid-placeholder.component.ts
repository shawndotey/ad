import { AdGridItemSize } from "../model/AdGridItem/AdGridItemSize";
import { AdGridItemPosition } from "../model/AdGridItem/AdGridItemPosition";
import { Component, ElementRef, Renderer, OnInit } from '@angular/core';
import { AdGridDirective } from '../ad-grid/ad-grid.directive';
import { AdGridDirectiveBase } from "../ad-grid/AdGridDirectiveBase";

@Component({
	selector: 'ad-grid-placeholder',
	template: ''
})
export class AdGridPlaceholderComponent implements OnInit {
	private _size: AdGridItemSize;
	private _position: AdGridItemPosition;
	private _AdGrid: AdGridDirective | AdGridDirectiveBase;
	private _cascadeMode: string;

	constructor(private _ngEl: ElementRef, private _renderer: Renderer) { }

	public registerGrid(AdGrid: AdGridDirective | AdGridDirectiveBase) {
		this._AdGrid = AdGrid;
	}

	public ngOnInit(): void {
		this._renderer.setElementClass(this._ngEl.nativeElement, 'grid-placeholder', true);
		if (this._AdGrid.autoStyle) this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'absolute');
	}

	public setSize(newSize: AdGridItemSize): void {
		this._size = newSize;
		this._recalculateDimensions();
	}

	public setGridPosition(newPosition: AdGridItemPosition): void {
		this._position = newPosition;
		this._recalculatePosition();
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

	private _recalculatePosition(): void {
		const x: number = (this._AdGrid.colWidth + this._AdGrid.marginLeft + this._AdGrid.marginRight) * (this._position.col - 1) + this._AdGrid.marginLeft + this._AdGrid.screenMargin;
		const y: number = (this._AdGrid.rowHeight + this._AdGrid.marginTop + this._AdGrid.marginBottom) * (this._position.row - 1) + this._AdGrid.marginTop;
		this._setPosition(x, y);
	}

	private _recalculateDimensions(): void {
		const w: number = (this._AdGrid.colWidth * this._size.x) + ((this._AdGrid.marginLeft + this._AdGrid.marginRight) * (this._size.x - 1));
		const h: number = (this._AdGrid.rowHeight * this._size.y) + ((this._AdGrid.marginTop + this._AdGrid.marginBottom) * (this._size.y - 1));
		this._setDimensions(w, h);
	}
}
