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
import { LogLevel, Logger, LogListener, DefaultTheme, LoggerTheme, getColorFromLevel, Loggable } from '../../log';
import { padWith } from './../../utils/';

export class AppLogger extends Logger implements LogListener {
  app:IApp;
  supportsColor:boolean;
  theme:LoggerTheme=DefaultTheme;

  constructor(app:IApp) {
    super();

    //Reference app
    this.app = app;
    this.addListener(this);
  }


  onLog(level:LogLevel, info:Loggable, logger:Logger, t:Date): void {
    //Are we in a development mode?
    if(level === LogLevel.DEBUG && this.app.environment !== Environment.DEVELOPMENT) return;

    //Get the current log level color
    let logColor = getColorFromLevel(this.getTheme(), level);

    //Begin the prefix
    let prefix = '';

    //Append our timestamp prefix strings
    let padZero = (n:number) => padWith(n, 2);
    prefix += this.theme.time(
      `${t.getFullYear()}-${padZero(t.getMonth()+1)}-${padZero(t.getDate())} ` +
      `${padZero(t.getHours())}:${padZero(t.getMinutes())}:${padZero(t.getSeconds())}.${padZero(t.getMilliseconds())}`
    );

    //Append the log level
    prefix += ' ' + logColor(`[${level.prefix}]`);

    //Now do the actual logging, depending on the type we're going to do some trickery

    //Errors, Log the stack
    if(info instanceof Error) info = info.stack;

    //Split strings by newline
    if(typeof info === "string") info = info.replace(/\r/g, '').split('\n');

    //If Array log each line, if object log as a set of lines
    if(Array.isArray(info)) {
      info.forEach(line => {
        if(typeof line === "string") line = logColor(line) as string;
        console.log(prefix, line);
      });
    } else {
      console.log(prefix, info);
    }

  }
}
