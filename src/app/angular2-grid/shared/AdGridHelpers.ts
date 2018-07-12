import { AdGridItemDirective } from '../ad-grid-item/ad-grid-item.directive';
import { ElementRef, Inject } from "@angular/core";




export function generateUuid(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export function sortItemsByPositionHorizontal(a: AdGridItemDirective, b: AdGridItemDirective): number {
	if (a.col === b.col) { return a.row - b.row; }
	return a.col - b.col;
}

export function sortItemsByPositionVertical(a: AdGridItemDirective, b: AdGridItemDirective): number {
	if (a.row === b.row) { return a.col - b.col; }
	return a.row - b.row;
}



export function hasSelectorFromStartToParentElement(handleSelector: string, startElement: HTMLElement, lastParentElement:ElementRef<any>): boolean {
	let targetElem: any = startElement;
	// try {
	while (targetElem && targetElem != lastParentElement) {
		if (doesElementMatchSelector(targetElem, handleSelector)){
			targetElem =null;
			return true;
		} 
		targetElem = targetElem.parentElement;
	}
	// } catch (err) {
	// 	targetElem =null;
	// }
	targetElem =null;
	return false;
}
export function doesElementMatchSelector(element: any, selector: string): boolean {
	if (!element) return false;
	if (element.matches) return element.matches(selector);
	if (element.oMatchesSelector) return element.oMatchesSelector(selector);
	if (element.msMatchesSelector) return element.msMatchesSelector(selector);
	if (element.mozMatchesSelector) return element.mozMatchesSelector(selector);
	if (element.webkitMatchesSelector) return element.webkitMatchesSelector(selector);

	if (!element.document || !element.ownerDocument) return false;

	const matches: any = (element.document || element.ownerDocument).querySelectorAll(selector);
	let i: number = matches.length;
	while (--i >= 0 && matches.item(i) !== element) { }
	return i > -1;
}