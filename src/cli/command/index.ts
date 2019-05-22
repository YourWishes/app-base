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
import { CommandOptions } from './../options/';

//Commander Interface, implemented by whatever is allowed to give commands
export interface ICLICommander {
  cliCommands:CLICommand[];

  addCommand(commmand:CLICommand);
  removeCommand(command:CLICommand);
}

//Command result, something that a command can return.
//There's essentially
export type CommandResult = boolean|void;

//CLICommand abstract class (for your handler)
export abstract class CLICommand {
  commander:ICLICommander;
  action:string;
  aliases:string[];

  constructor(commander:ICLICommander, action:string, aliases:string[]=[]) {
    if(!commander) throw new Error("Invalid or missing commander");
    this.commander = commander;
    this.action = action;
    this.aliases = aliases;
  }

  isAction(action:string) {
    if(this.action == '*') return true;
    action = action.toLowerCase();
    return action == this.action.toLowerCase() || this.aliases.some(alias => alias.toLowerCase() == action);
  }

  abstract onCommand(app:IApp, action:string, options:CommandOptions):Promise<CommandResult>;
}
