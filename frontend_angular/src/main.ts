import { bootstrapApplication } from "@angular/platform-browser"
import { provideRouter } from "@angular/router"
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http"
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { importProvidersFrom } from "@angular/core"
import { MatSnackBarModule } from "@angular/material/snack-bar"

import { AppComponent } from "./app/app"
import { routes } from "./app/app.routes"

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule),
  ],
}).catch((err) => console.error(err))



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
