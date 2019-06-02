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

import { LogLevel } from './../level/';
import * as LogLevels from './../level';
import { LogListener } from './../listener/';
import { LoggerTheme, DefaultTheme } from './../theme/';

export type Loggable = (
  string|Error|any[]|any
);

export class Logger {
  parent:Logger;
  listeners:LogListener[]=[];

  constructor(parent:Logger=null) {
    this.parent = parent;
  }

  getTheme():LoggerTheme {
    return this.parent ? this.parent.getTheme() : DefaultTheme;
  }

  addListener(listener:LogListener) {
    if(listener === null) throw new Error("Invalid Log Listener");
    if(this.listeners.indexOf(listener) !== -1) return;
    this.listeners.push(listener);
  }

  removeListener(listener:LogListener) {
    if(listener === null) throw new Error("Invalid Log Listener");
    let index = this.listeners.indexOf(listener);
    if(index === -1) return;
    this.listeners.splice(index, 1);
  }

  /*** Logging methods ***/

  //Root logging method.
  log(level:LogLevel, info:Loggable, source:Logger=null, time:Date=null) {
    source = source || this;
    time = time || new Date();

    //First let's pass the logging information to our log listeners.
    this.listeners.forEach((listener:LogListener) => {
      listener.onLog(level, info, source, time);
    });

    //Now let's pass it to our parent.
    if(this.parent instanceof Logger) this.parent.log(level, info, source, time);
  }

  //Methods for different levels
  debug(info:Loggable, source:Logger=null, time:Date=null) {
    this.log(LogLevels.DEBUG, info, source, time);
  }

  info(info:Loggable, source:Logger=null, time:Date=null) {
    this.log(LogLevels.INFO, info, source, time);
  }

  warn(info:Loggable, source:Logger=null, time:Date=null) {
    this.log(LogLevels.WARN, info, source, time);
  }

  error(info:Loggable, source:Logger=null, time:Date=null) {
    this.log(LogLevels.ERROR, info, source, time);
  }

  severe(info:Loggable, source:Logger=null, time:Date=null) {
    this.log(LogLevels.SEVERE, info, source, time);
  }
}
