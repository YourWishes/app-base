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

import { CLICommand, CommandResult, ICLICommander } from './../command/';
import { CommandOptions } from './../options/';
import { App } from './../../app/';
import { getEnvironments, Environment } from './../../environment/';

export class EnvironmentCommand extends CLICommand {
  constructor(commander:ICLICommander) {
    super(
      commander, 'environment', getEnvironments().reduce((x,e) => [...x,e,e.slice(0,1)], [])
    );
  }

  async onCommand(app:App, action:string, options:CommandOptions):Promise<CommandResult> {
    let envs = getEnvironments();
    let env = (options.args['environment'] || envs.find(e => {
      if(options.flags[e]) return true;//-development
      if(options.flags[e.slice(0, 1)]) return true;//-d
      return false;
    })) as Environment;

    if(!env) return false;

    process.env['NODE_ENV'] = env.toLowerCase();
    app.environment = env;
    app.logger.info(`Environment set to ${app.logger.theme.success(env)}.`);
  }
}
