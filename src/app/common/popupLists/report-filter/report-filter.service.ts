import { AuthService } from "../../services/permission"
import { GlobalState } from "../../../global.state"
import { Http } from "@angular/http"
import { ReportFilterOption } from "./report-filter.component"


export class ReportFilterService {

   
    public selectedRowIndex = 0
    ReportFilterObj: ReportFilterOption = <ReportFilterOption>{}
    constructor(private http: Http, private authService: AuthService, private state: GlobalState) {

    }}