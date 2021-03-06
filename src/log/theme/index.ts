/*
 * Copyright (c) 2019 Dominic Masters
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as chalk from 'chalk';
import { Chalk } from 'chalk';
import { LogLevel } from './../level/';

export interface LoggerTheme {
  severe:Chalk;
  error:Chalk;
  warning:Chalk;
  debug:Chalk;
  highlight:Chalk;
  success:Chalk;
  time:Chalk;
  default:Chalk|null;
}

export const DefaultTheme:LoggerTheme = {
  severe:chalk.default.bgRed.white,
  error:chalk.default.red,
  warning:chalk.default.yellow,
  debug:chalk.default.hex('#666666'),
  highlight:chalk.default.magenta,
  success:chalk.default.green,
  time:chalk.default.hex('#666666'),
  default:null
}

export const getColorFromLevel = (theme:LoggerTheme, level:LogLevel) => {
  let defColor = theme.default || chalk.default.reset;

  switch(level) {
    case LogLevel.INFO:
      return defColor;

    case LogLevel.SUCCESS:
      return theme.success || defColor;

    case LogLevel.DEBUG:
      return theme.debug || defColor;

    case LogLevel.ERROR:
      return theme.error || defColor;

    case LogLevel.SEVERE:
      return theme.severe || defColor;

    case LogLevel.WARN:
      return theme.warning || defColor;

    default:
      return defColor;
  }
}
