import { NgModule } from "@angular/core";
import { routing } from "./masters.routing";
import { Masters } from "./masters.component";
import { CanActivateTeam } from "../../common/services/permission/guard.service";
import { ResolveMasterFormData } from "../../common/repositories/ResolveMasterFormData.service";


@NgModule({
  imports: [
    routing,
  ],
  declarations: [
    Masters
    
  ],
  providers: [CanActivateTeam,ResolveMasterFormData]
})
export class MastersModule {}
