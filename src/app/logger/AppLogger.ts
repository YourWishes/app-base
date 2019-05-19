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

import { IApp } from './../IApp';
import { Environment } from './../../environment/';
import { LogLevel, Logger, LogListener } from './../../logger/';
import { padWith } from './../../utils/';
import { AppLoggerTheme, DefaultTheme } from './AppLoggerTheme';
import * as chalk from 'chalk';

export class AppLogger extends Logger implements LogListener {
  app:IApp;
  supportsColor:boolean;
  theme:AppLoggerTheme=DefaultTheme;

  constructor(app:IApp) {
    super();

    //Reference app
    this.app = app;
    this.addListener(this);
  }

  getColorFromLevel(level:LogLevel) {
    switch(level) {
      case LogLevel.INFO:
        return this.theme.default  || chalk.default.reset;
      case LogLevel.DEBUG:
        return this.theme.debug;
      case LogLevel.ERROR:
        return this.theme.error;
      case LogLevel.SEVERE:
        return this.theme.severe;
      case LogLevel.WARN:
        return this.theme.warning;
      default:
        return this.theme.default || chalk.default.reset;
    }
  }

  onLog(level:LogLevel, info:string|Error, logger:Logger, t:Date): void {
    //Are we in a development mode?
    if(level === LogLevel.DEBUG && this.app.environment !== Environment.DEVELOPMENT) return;

    //Get the current log level color
    let logColor = this.getColorFromLevel(level);

    //Begin the prefix
    let prefix = '';

    //Append our timestamp prefix strings
    let padZero = (n:number) => padWith(n, 2);
    prefix += this.theme.time(
      `${t.getFullYear()}-${padZero(t.getMonth()+1)}-${padZero(t.getDate())}` +
      `${padZero(t.getHours())}:${padZero(t.getMinutes())}:${padZero(t.getSeconds())}.${padZero(t.getMilliseconds())}`
    );

    //Append the log level
    prefix += ' ' + logColor(`[${level.prefix}]`);

    //Now we have our prefix, we're going to create an array of single line strings
    //First, if this is an error we need to generate a stack trace.
    if(info instanceof Error) info = info.stack;
    let lines:string[] = info.replace(/\r/g, '').split('\n');


    //Now Foreach Line log to console
    lines.forEach(line => {
      console.log(`${prefix}${logColor(line)}`);
    });
  }
}
