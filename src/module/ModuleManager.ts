// Copyright (c) 2019 Dominic Masters
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

import { Module } from './Module';
import { IApp } from '~app';

export class ModuleManager {
  app:IApp;
  modules:Module[]=[];

  constructor(app:IApp) {
    if(!app) throw new Error("Invalid App Supplied");
    this.app = app;
  }

  addModule(module:Module):void {
    if(!module) throw new Error("Invalid Module");
    if(this.modules.includes(module)) return;
    this.modules.push(module);
  }

  removeModule(module:Module):void {
    if(!module) throw new Error("Invalid Module");
    let index = this.modules.indexOf(module);
    if(index === -1) return;
    this.modules.splice(index, 1);
  }

  async init():Promise<void> {
    for(let module of this.modules) {
      await module.init();
    }

    this.modules.forEach(m => {
      this.updateCheck(m).catch(e => m.logger.error(e));
    });
  }

  async updateCheck(module:Module):Promise<boolean> {
    let current = await module.getCurrentVersion();
    let next = await module.getNewVersion();
    if(current.every((c,i) => {
      if(next.length-1 < i) return true;
      return c >= next[i]
    })) return false;
    module.logger.info(`${module.getName()} has an update ${current.join('.')} => ${next.join('.')}`);
    return true;
  }

  async destroy():Promise<void> {
  }
}
