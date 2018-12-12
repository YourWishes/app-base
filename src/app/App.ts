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

import Module from './../module/Module';
import Configuration from './../config/Configuration';

export default abstract class App {
  modules:Module[]=[];
  config:Configuration;

  constructor() {
    this.config = new Configuration();
  }

  addModule(module:Module):void {
    if(!(module instanceof Module)) throw "Invalid Module";
    if(this.modules.includes(module)) return;
    this.modules.push(module);
  }

  removeModule(module:Module):void {
    if(!(module instanceof Module)) throw "Invalid Module";
    let index = this.modules.indexOf(module);
    if(index === -1) return;
    this.modules.splice(index, 1);
  }

  async init():Promise<void> {
    await this.config.loadConfig();
    
    for(let module of this.modules) {
      await module.init();
    }
  }
}
