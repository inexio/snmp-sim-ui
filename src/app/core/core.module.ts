import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import {
    NzAlertModule,
    NzAvatarModule,
    NzBadgeModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzDrawerModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzSkeletonModule,
    NzStepsModule,
    NzTagModule,
    NzToolTipModule,
    NzUploadModule,
} from "ng-zorro-antd";
import { AgentPreviewComponent } from "./components/agent-preview/agent-preview.component";
import { EndpointPreviewComponent } from "./components/endpoint-preview/endpoint-preview.component";
import { EnginePreviewComponent } from "./components/engine-preview/engine-preview.component";
import { LabPreviewComponent } from "./components/lab-preview/lab-preview.component";
import { UserPreviewComponent } from "./components/user-preview/user-preview.component";
import { AddAgentComponent } from "./drawer/add-agent/add-agent.component";
import { AddEndpointComponent } from "./drawer/add-endpoint/add-endpoint.component";
import { AddEngineComponent } from "./drawer/add-engine/add-engine.component";
import { AddUserComponent } from "./drawer/add-user/add-user.component";
import { AttachTagsComponent } from "./drawer/attach-tags/attach-tags.component";
import { CreateAgentComponent } from "./drawer/create-agent/create-agent.component";
import { CreateEndpointComponent } from "./drawer/create-endpoint/create-endpoint.component";
import { CreateEngineComponent } from "./drawer/create-engine/create-engine.component";
import { CreateLabComponent } from "./drawer/create-lab/create-lab.component";
import { CreateTagComponent } from "./drawer/create-tag/create-tag.component";
import { CreateUserComponent } from "./drawer/create-user/create-user.component";
import { UserKeysComponent } from "./drawer/user-keys/user-keys.component";
import { CreateRecordFileComponent } from "./modals/create-record-file/create-record-file.component";
import { RecordFilePreviewComponent } from "./modals/record-file-preview/record-file-preview.component";
import { BytesPipe } from "./pipes/bytes.pipe";
import { ProcessPreviewComponent } from "./components/process-preview/process-preview.component";

@NgModule({
    declarations: [
        LabPreviewComponent,
        AgentPreviewComponent,
        CreateTagComponent,
        BytesPipe,
        CreateRecordFileComponent,
        RecordFilePreviewComponent,
        EnginePreviewComponent,
        EndpointPreviewComponent,
        UserPreviewComponent,
        AttachTagsComponent,
        CreateLabComponent,
        CreateAgentComponent,
        AddAgentComponent,
        CreateEngineComponent,
        AddEngineComponent,
        CreateEndpointComponent,
        CreateUserComponent,
        AddUserComponent,
        AddEndpointComponent,
        UserKeysComponent,
        ProcessPreviewComponent,
    ],
    imports: [
        CommonModule,
        NzCardModule,
        NzSkeletonModule,
        NzAvatarModule,
        NzIconModule,
        NzBadgeModule,
        NzTagModule,
        NzInputModule,
        FormsModule,
        NzSelectModule,
        NzTagModule,
        NzUploadModule,
        NzButtonModule,
        NgApexchartsModule,
        NzToolTipModule,
        NzSkeletonModule,
        NzAlertModule,
        RouterModule,
        NzDrawerModule,
        NzDividerModule,
        NzToolTipModule,
        NzStepsModule,
    ],
    exports: [
        LabPreviewComponent,
        AgentPreviewComponent,
        EnginePreviewComponent,
        EndpointPreviewComponent,
        UserPreviewComponent,
        ProcessPreviewComponent,
        BytesPipe,
    ],
    entryComponents: [
        CreateTagComponent,
        CreateRecordFileComponent,
        RecordFilePreviewComponent,
        AttachTagsComponent,
        CreateLabComponent,
        CreateAgentComponent,
        AddAgentComponent,
        CreateEngineComponent,
        AddEngineComponent,
        CreateEndpointComponent,
        CreateUserComponent,
        AddEndpointComponent,
        AddUserComponent,
        UserKeysComponent,
    ],
})
export class CoreModule {}
