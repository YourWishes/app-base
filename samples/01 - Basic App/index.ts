///Import our app instance
import { MyApp } from './app/';

//Now you can construct your app...
let app = new MyApp();

//...and get it running
app.init().catch(error => app.logger.severe(error));
