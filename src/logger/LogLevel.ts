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

export class LogLevel {
  static DEBUG:LogLevel;
  static INFO:LogLevel;
  static WARN:LogLevel;
  static ERROR:LogLevel;
  static SEVERE:LogLevel;

  level:number;
  name:string;
  prefix:string;

  constructor(level:number, name:string, prefix:string) {
    this.level = level;
    this.name = name;
    this.prefix = prefix;
  }
}

export const DEBUG = LogLevel.DEBUG = new LogLevel(30, 'Debug', 'DEBUG');
export const INFO = LogLevel.INFO = new LogLevel(20, 'Info', 'INFO');
export const WARN = LogLevel.WARN = new LogLevel(10, 'Warning', 'WARN');
export const ERROR = LogLevel.ERROR = new LogLevel(5, 'Error', 'ERROR');
export const SEVERE = LogLevel.SEVERE = new LogLevel(0, 'Severe', 'SEVERE');
