import { Module, IApp } from './../../../dist/';

//Setup your app interface, this allows you to tell the app how you want it to
//construct your module, and how other modules can interface with it if they
//so desire.
export interface IMyCoolApp extends IApp {
  myCoolModule:MyCoolModule;
}

export class MyCoolModule extends Module {
  constructor(app:IMyCoolApp) {
    super(app);
  }

  async init():Promise<void> {
    this.logger.info(`My cool module is initializing`);

    //Do some stuff, this is an async so you're allowed to do some awaiting.
    //However the app module is blocking right now, so that means all your
    //awaits will delay the main thread.
    await new Promise(resolve => setTimeout(resolve, 200));

    this.logger.success(`My cool module has finished initizializing.`);
  }

  async destroy():Promise<void> {

  }
}
