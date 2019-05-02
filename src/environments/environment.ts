import { AppLayoutConfigurationOptions } from './../app/core/configuration/model/AppLayoutConfigurationOptions.class';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const layout = new AppLayoutConfigurationOptions();
layout.mainSideNavOpenOnStart = false;

export const environment = {
  production: false,
  loggedInOnStart: true,
  baseHref: '/',
  layout
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
