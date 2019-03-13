// Copyright (c) 2018 Dominic Masters
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { IApp } from './IApp';
import { Environment, getEnvironmentFromString } from './../environment/';
import { ModuleManager } from './../module/';
import { Configuration } from './../config/Configuration';
import { AppLogger } from './AppLogger';

//export const CONFIGURATION_CHECK_UPDATES = 'update.check';

export abstract class App implements IApp {
  environment:Environment;
  modules:ModuleManager;
  config:Configuration;
  logger:AppLogger;

  constructor() {
    //First thing first, we MUST determine what environment we're running under.
    let pe:string = null;
    if(process && process.env) pe = process.env['NODE_ENV'];
    this.environment = getEnvironmentFromString(pe);

    //Setup core app components
    this.logger = new AppLogger(this);
    this.config = new Configuration();
    this.modules = new ModuleManager(this);
  }

  async init():Promise<void> {
    this.logger.info(`Starting app in ${this.environment} mode.`);

    //Init the core modules
    await this.config.loadConfig();
    await this.modules.init();

    this.logger.info('The app has started successfully.');
  }

  async stop():Promise<void> {

  }
}
