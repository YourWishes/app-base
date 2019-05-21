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

export type CommandFlag = boolean;
export type CommandFlags = {[key:string]:CommandFlag};

export type CommandArgument = string|number|CommandFlag;
export type CommandArguments = {[key:string]:CommandArgument};

export interface CommandOptions {
  args:CommandArguments;
  flags:CommandFlags;
}


export const getOptionsForArgs = (inp:string[]):CommandOptions => {
  inp = inp || [];
  
  let args:CommandArguments = {};
  let flags:CommandFlags = {};

  let lastArgs:string[] = [];
  let checkLast = () => {
    //This function will check the value of lastArgs and append it appropriately
    if(!lastArgs.length) return;

    let key = lastArgs.shift();
    let value = lastArgs.length ? lastArgs.join(' ') : true;

    //Parse value
    if(value == 'true') value = true;
    if(value == 'false') value = false;

    if(value === true || value == false) {
      flags[key] = value;
    }

    args[key] = value;
    lastArgs = [];
  };

  //Process the process args, we start at 2 since 0 is bin and 1 in the script
  for(let i = 0; i < inp.length; i++) {
    let arg = inp[i];
    let isFlag = arg.startsWith('-');

    //First, let's check the buffer history
    if(isFlag) {
      checkLast();
      arg = arg.slice(1);
    }
    lastArgs.push(arg);
  }
  
  checkLast();

  return { args, flags };
}