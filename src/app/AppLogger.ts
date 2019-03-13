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

import { IApp } from './IApp';
import { Environment } from './../environment/';
import { LogLevel, Logger, LogListener } from './../logger/';
import { padWith } from './../utils/';

export class AppLogger extends Logger implements LogListener {
  app:IApp;

  constructor(app:IApp) {
    super();

    this.app = app;
    this.addListener(this);
  }

  onLog(level:LogLevel, info:string|Error, logger:Logger, t:Date): void {
    //Are we in a development mode?
    if(level === LogLevel.DEBUG && this.app.environment !== Environment.DEVELOPMENT) return;

    let padZero = (n:number) => padWith(n, 2);

    //Prepare our prefix
    let date:string = `${t.getFullYear()}-${padZero(t.getMonth()+1)}-${padZero(t.getDate())}`;
    let time:string = `${padZero(t.getHours())}:${padZero(t.getMinutes())}:${padZero(t.getSeconds())}.${padZero(t.getMilliseconds())}`;
    let prefix:string = `${date} ${time} [${level.prefix}]`;

    //Now we have our prefix, we're going to create an array of single line strings
    //First, if this is an error we need to generate a stack trace.
    if(info instanceof Error) info = info.stack;
    let lines:string[] = info.replace(/\r/g, '').split('\n');


    //Now Foreach Line log to console
    lines.forEach(line => {
      console.log(`${prefix} ${line}`);
    });
  }
}
