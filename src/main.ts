import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  // {
  //   "hosting": {
  //     "target": "kanban-fire",
  //     "public": "dist/kanban-fire",
  //     "ignore": [
  //       "**/.*"
  //     ],
  //     "headers": [
  //       {
  //         "source": "*.[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f].+(css|js)",
  //         "headers": [
  //           {
  //             "key": "Cache-Control",
  //             "value": "public,max-age=31536000,immutable"
  //           }
  //         ]
  //       },
  //       {
  //         "source": "/@(ngsw-worker.js|ngsw.json)",
  //         "headers": [
  //           {
  //             "key": "Cache-Control",
  //             "value": "no-cache"
  //           }
  //         ]
  //       }
  //     ],
  //     "rewrites": [
  //       {
  //         "source": "**",
  //         "destination": "/index.html"
  //       }
  //     ]
  //   }
  // }