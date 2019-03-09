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

import { App } from './../app/';
import { NPMRepository } from './../utils/';
import { fetch } from 'cross-fetch';
import { IUpdateable } from './IUpdateable';

export class UpdateChecker {
  app:App;
  updateables:IUpdateable[] = [];

  constructor(app:App) {
    if(!app) throw new Error("Invalid App supplied");
    this.app = app;
  }

  addUpdateable(u:IUpdateable) {
    if(!u) throw new Error("Invalid Updateable supplied");
    if(this.updateables.indexOf(u) !== -1) return;
    this.updateables.push(u);
  }

  removeUpdateable(u:IUpdateable) {
    if(!u) throw new Error("Invalid Updateable supplied");
    let index = this.updateables.indexOf(u);
    if(index === -1) return;
    this.updateables.splice(index, 1);
  }

  async start() {
    this.app.logger.debug(`Checking for updates...`);
    let proms = this.updateables.map(async e => {
      let current = await e.getCurrentVersion();
      let next = await e.getNewVersion();

      if(current.length === next.length) {
        let u = current.every((c,i) => c >= next[i]);
        if(u) return;
      }

      this.app.logger.info(`Module ${e.getName()} has an update ${current.join('.')} => ${next.join('.')}`);
    });

    await Promise.all(proms);
    this.app.logger.info(`Finished checking for updates.`);
  }
}
