import { Inject , Injectable} from '@angular/core';

import "reflect-metadata";
declare var Reflect: any;
export function ExtendMixin(...baseCtors: Function[]) {
	return function (derivedCtor: Function) {
		baseCtors.forEach(baseCtor => {
			const fieldCollector = {};
			baseCtor.apply(fieldCollector);
			completeAssign(derivedCtor.prototype, fieldCollector);
			Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
				const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
				Object.defineProperty(derivedCtor.prototype, name, descriptor);
				if (descriptor && (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable || descriptor.get || descriptor.set)) {
					derivedCtor.prototype[name] = baseCtor.prototype[name];
				}
				else {
					derivedCtor.prototype[name] = baseCtor.prototype[name];
				}
			});
		});
	};
}

export function completeAssign(target, ...sources) {
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



	

//https://medium.com/@artsiomkuts/typescript-mixins-with-angular2-di-671a9b159d47
export type MixinConstructor<T> = new(...args: any[]) => T;
let resolveParameters = function (target: any, params: any[]) {
  if(params) {
      params.forEach((param, index) => {
          // this code is needed to make @Inject work
          if (param && param.annotation && param.annotation instanceof Inject) {
              param(target, void 0, index);
          }
      });
  }
  return Reflect.getMetadata('parameters', target);
};
let getParamTypesAndParameters = function(target, paramTypes, rawParameters) {
  var parameters = Array(paramTypes.length).fill(null);
  if(rawParameters) {
      rawParameters.slice(0, paramTypes.length).forEach((el, i) => {
          parameters[i] = el;
      });
  }
  return [paramTypes, parameters];
};
export function MixinInjectable(...paramTypes: any[]) {

  return function (childTarget: any) {
      let parentTarget = Object.getPrototypeOf(childTarget.prototype).constructor;
      let [parentParamTypes, parentParameters] = getParamTypesAndParameters(parentTarget,
          Reflect.getMetadata('design:paramtypes', parentTarget),
          Reflect.getMetadata('parameters', parentTarget)
      );
      let [childParamTypes, childParameters] = getParamTypesAndParameters(childTarget,
          paramTypes || [],
          resolveParameters(childTarget, paramTypes)
      );

      Reflect.defineMetadata('design:paramtypes', childParamTypes.concat(parentParamTypes), childTarget);
      Reflect.defineMetadata('parameters', childParameters.concat(parentParameters), childTarget);
      Reflect.defineMetadata('parentParameters', parentParameters, childTarget);
  }
}

