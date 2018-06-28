import { NgGridItemSize } from "../model/NgGridItem/NgGridItemSize";
import { NgGridItemPosition } from "../model/NgGridItem/NgGridItemPosition";
import { Component, ElementRef, Renderer, OnInit } from '@angular/core';
import { NgGridDirective } from '../ng-grid/ng-grid.directive';

@Component({
	selector: 'ng-grid-placeholder',
	template: ''
})
export class NgGridPlaceholderComponent implements OnInit {
	private _size: NgGridItemSize;
	private _position: NgGridItemPosition;
	private _ngGrid: NgGridDirective;
	private _cascadeMode: string;

	constructor(private _ngEl: ElementRef, private _renderer: Renderer) { }

	public registerGrid(ngGrid: NgGridDirective) {
		this._ngGrid = ngGrid;
	}

	public ngOnInit(): void {
		this._renderer.setElementClass(this._ngEl.nativeElement, 'grid-placeholder', true);
		if (this._ngGrid.autoStyle) this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'absolute');
	}

	public setSize(newSize: NgGridItemSize): void {
		this._size = newSize;
		this._recalculateDimensions();
	}

	public setGridPosition(newPosition: NgGridItemPosition): void {
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
		const x: number = (this._ngGrid.colWidth + this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._position.col - 1) + this._ngGrid.marginLeft + this._ngGrid.screenMargin;
		const y: number = (this._ngGrid.rowHeight + this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._position.row - 1) + this._ngGrid.marginTop;
		this._setPosition(x, y);
	}

	private _recalculateDimensions(): void {
		const w: number = (this._ngGrid.colWidth * this._size.x) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._size.x - 1));
		const h: number = (this._ngGrid.rowHeight * this._size.y) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._size.y - 1));
		this._setDimensions(w, h);
	}
}
