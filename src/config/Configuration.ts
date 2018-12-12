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

import * as path from 'path';
import * as fs from 'fs';

export default class Configuration {
  data:object;

  constructor() {
  }

  isHeroku():boolean {
    let { env } = process;
    env = env || {};
    let { NODE_HOME } = env;
    return NODE_HOME && NODE_HOME.indexOf("heroku") !== -1;
  }

  getConfigFilePath():string {
    return path.resolve('private', 'data', 'config.json');
  }

  async loadConfig():Promise<void> {
    if(this.isHeroku()) {
      this.data = process.env || {};
      return;
    }

    let filePath = this.getConfigFilePath();
    if(!fs.existsSync(filePath)) throw "Configuration file does not exist!";
    let dataRaw = fs.readFileSync(filePath, 'utf8');
    this.data = JSON.parse(dataRaw);
  }

  has(key:string):boolean {
    let value = this.get(key);
    if(!value) return false;
    return value.length !== 0;
  }

  get(key:string=""):string|null {
    if(this.isHeroku()) {
      key = key.replace(/\./g, '_').toUpperCase();
      if(typeof this.data[key] === typeof undefined) return null;
      return this.data[key];
    }
    return this.getRecursive(key.split("."));
  }

  getRecursive(key_array:Array<string>, data_obj?:object):string|null {
    if(typeof data_obj === typeof undefined) data_obj = this.data;
    if(typeof data_obj === typeof undefined) return null;

    let k = key_array[0];
    let o = data_obj[k];
    if(typeof o === typeof undefined) return null;

    //Awesome
    if(key_array.length > 1) {
      if(typeof o !== typeof {}) return null;
      key_array.shift();
      return this.getRecursive(key_array, o);
    }
    return o;
  }
}
