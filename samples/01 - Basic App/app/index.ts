//Import the app. In a final version you would replace this with the NPM import
//e.g. @yourwishes/app-base if using the official branch.
import { App } from './../../../dist/';

import { MyCoolModule, IMyCoolApp } from './../module/';

import * as path from 'path';

//Now you'll need to setup your app class to be constructed later.
export class MyApp extends App implements IMyCoolApp {
  //The IMyCoolApp requires this to exist and be set.
  myCoolModule: MyCoolModule;

  constructor() {
    super();

    //Setup and add our module.
    this.myCoolModule = new MyCoolModule(this);
    this.modules.addModule(this.myCoolModule);
  }
}
