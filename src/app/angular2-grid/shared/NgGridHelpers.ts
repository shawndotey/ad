import { NgGridItemDirective } from './../ng-grid-item/ng-grid-item.directive';
import { ElementRef, Inject } from "@angular/core";


function completeAssign(target, ...sources) {
	sources.forEach(source => {
	  let descriptors = Object.keys(source).reduce((descriptors, key) => {
		descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
		return descriptors;
	  }, {});
	  // by default, Object.assign copies enumerable Symbols too
	  Object.getOwnPropertySymbols(source).forEach(sym => {
		let descriptor = Object.getOwnPropertyDescriptor(source, sym);
		if (descriptor.enumerable) {
		  descriptors[sym] = descriptor;
		}
	  });
	  Object.defineProperties(target, descriptors);
	});
	return target;
  }


export function ExtendMixin(baseCtors: Function[]) {
	return function (derivedCtor: Function) {
		baseCtors.forEach(baseCtor => {
			const fieldCollector = {};
			baseCtor.apply(fieldCollector);
			completeAssign(derivedCtor.prototype, fieldCollector)
			Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
				const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
				Object.defineProperty(derivedCtor.prototype, name, descriptor);
				if (descriptor && (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable || descriptor.get || descriptor.set)) {
					derivedCtor.prototype[name] = baseCtor.prototype[name];
				} else {
					derivedCtor.prototype[name] = baseCtor.prototype[name];
				}
			});
		});
	};
}


export function generateUuid(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export function sortItemsByPositionHorizontal(a: NgGridItemDirective, b: NgGridItemDirective): number {
	if (a.col === b.col) { return a.row - b.row; }
	return a.col - b.col;
}

export function sortItemsByPositionVertical(a: NgGridItemDirective, b: NgGridItemDirective): number {
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