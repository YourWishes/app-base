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

import { IApp } from './../app/';
import { Logger } from './../logger/';
import { NPMPackage, getPackageVersion, getGitVersion } from './../utils';
import { IUpdateable, Version } from './../update/';

export abstract class Module implements IUpdateable {
  app:IApp;
  logger:Logger;
  package:NPMPackage;

  constructor(app:IApp) {
    if(!app) throw new Error("Invalid App");
    this.app = app;
    this.logger = new Logger(app.logger);

    //Load package information into cache
    this.package = this.loadPackage();
  }

  abstract async init():Promise<void>;
  abstract async destroy():Promise<void>;
  loadPackage():NPMPackage { return null; };

  getName():string {
    if(!this.package) throw new Error("Missing package data");
    if(!this.package.name || !this.package.name.length) throw new Error("Missing name in package data");
    return this.package.name;
  }

  async getCurrentVersion():Promise<Version> {
    if(!this.package) throw new Error("Missing package data");
    return getPackageVersion(this.package.version);
  }

  async getNewVersion():Promise<Version> {
    if(!this.package) throw new Error("Missing package data");
    return getGitVersion(this.package);
  }
}
