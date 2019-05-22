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

import { IApp } from './../../app/';
import { CommandOptions, getOptionsForArgs } from './../options/';
import { ICLICommander, CLICommand } from './../command/';

//CLI Interface
let cli = null;
export type CLIProgram = (app:IApp) => Promise<boolean>;
export const useCLI = (program:CLIProgram) => cli = program;

export class CLIManager implements ICLICommander {
  app:IApp;
  cliCommands:CLICommand[]=[];

  constructor(app:IApp) {
    if(!app) throw new Error('Please supply a valid App');
    this.app = app;
  }

  addCommand(command:CLICommand) {
    if(!command) throw new Error('Invalid Command!');
    if(this.cliCommands.indexOf(command) !== -1) return;
    this.cliCommands.push(command);
  }

  removeCommand(command:CLICommand) {
    if(!command) throw new Error('Invalid Command!');
    let i = this.cliCommands.indexOf(command);
    if(i === -1) return;
    this.cliCommands.splice(i,1);
  }

  async run():Promise<boolean> {
    //Dupe so we can safely modify
    let cliArgs = [ ...process.argv ];

    let handle = cliArgs.shift();//This is the node path
    let command = cliArgs.shift();//This is the command that was executed (e.g. node or ping)

    //Since the structure requires an "action, there must be at least 1 element
    if(!cliArgs.length) return;//No element, no action
    let action = cliArgs.shift();
    let options = getOptionsForArgs(cliArgs);//Determine flags and args

    //First we're going to hint to this itself the current command details.
    //The purpose of this is to allow the app to set certain variables based on
    //the flags. Although the app may have some reserved actions which take priority
    if(await this.execute(this, action, options)) return true;

    //Now we're going to do module commands
    for(let i = 0; i < this.app.modules.modules.length; i++) {
      let m = this.app.modules.modules[i];
      if(await this.execute(m, action, options)) return true;
    }

    return false;
  }

  async execute(commander:ICLICommander, action:string, options:CommandOptions):Promise<boolean> {
    //This function will execute a command against a commander (e.g. app or module)
    //And will process its response. It will return TRUE if it was handled
    //otherwise it will return false (not processed or processed without blocking   commander

    for(let i = 0; i < commander.cliCommands.length; i++) {
      let cmd = commander.cliCommands[i];
      let result = await cmd.onCommand(this.app, action, options);

      //Depending on what we get as a result, we'l return either TRUE, or FALSE
      //true being "handled in a way that stops other commands receiving"
      //false being "either not handled, or handled in a way that allows other commands to do their thing"
      if(result) return true;
    };

    return false;
  }

  ready() {
    if(cli && !cli()) process.exit(-1);
  }
}
