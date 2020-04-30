import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TranslateModule } from "@ngx-translate/core";

import { FormsModule } from "@angular/forms";
import { PageNotFoundComponent } from "./components/";
import { WebviewDirective } from "./directives/";

@NgModule({
    declarations: [PageNotFoundComponent, WebviewDirective],
    imports: [CommonModule, TranslateModule, FormsModule],
    exports: [TranslateModule, WebviewDirective, FormsModule],
})
export class SharedModule {}
