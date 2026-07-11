import { APIResource } from "../../../../core/resource.mjs";
import * as ArtifactsAPI from "./artifacts.mjs";
import { Artifacts } from "./artifacts.mjs";
import * as ConnectorsAPI from "./connectors.mjs";
import { Connectors } from "./connectors.mjs";
import * as CostAPI from "./cost.mjs";
import { Cost, } from "./cost.mjs";
import * as CostReportAPI from "./cost-report.mjs";
import { CostReport } from "./cost-report.mjs";
import * as PluginsAPI from "./plugins.mjs";
import { Plugins } from "./plugins.mjs";
import * as SkillsAPI from "./skills.mjs";
import { Skills } from "./skills.mjs";
import * as SummariesAPI from "./summaries.mjs";
import { Summaries } from "./summaries.mjs";
import * as UsageAPI from "./usage.mjs";
import { Usage, } from "./usage.mjs";
import * as UsageReportAPI from "./usage-report.mjs";
import { UsageReport } from "./usage-report.mjs";
import * as UserCostReportAPI from "./user-cost-report.mjs";
import { UserCostReport } from "./user-cost-report.mjs";
import * as UserUsageReportAPI from "./user-usage-report.mjs";
import { UserUsageReport } from "./user-usage-report.mjs";
import * as UsersAPI from "./users.mjs";
import { Users } from "./users.mjs";
import * as AppsAPI from "./apps/apps.mjs";
import { Apps } from "./apps/apps.mjs";
export var Analytics = /* @__PURE__ */ (() => {
    class Analytics extends APIResource {
        constructor() {
            super(...arguments);
            this.summaries = new SummariesAPI.Summaries(this._client);
            this.users = new UsersAPI.Users(this._client);
            this.apps = new AppsAPI.Apps(this._client);
            this.connectors = new ConnectorsAPI.Connectors(this._client);
            this.plugins = new PluginsAPI.Plugins(this._client);
            this.skills = new SkillsAPI.Skills(this._client);
            this.artifacts = new ArtifactsAPI.Artifacts(this._client);
            this.usage = new UsageAPI.Usage(this._client);
            this.cost = new CostAPI.Cost(this._client);
            this.usageReport = new UsageReportAPI.UsageReport(this._client);
            this.userUsageReport = new UserUsageReportAPI.UserUsageReport(this._client);
            this.costReport = new CostReportAPI.CostReport(this._client);
            this.userCostReport = new UserCostReportAPI.UserCostReport(this._client);
        }
    }
    Analytics.Summaries = Summaries;
    Analytics.Users = Users;
    Analytics.Apps = Apps;
    Analytics.Connectors = Connectors;
    Analytics.Plugins = Plugins;
    Analytics.Skills = Skills;
    Analytics.Artifacts = Artifacts;
    Analytics.Usage = Usage;
    Analytics.Cost = Cost;
    Analytics.UsageReport = UsageReport;
    Analytics.UserUsageReport = UserUsageReport;
    Analytics.CostReport = CostReport;
    Analytics.UserCostReport = UserCostReport;
    return Analytics;
})();
//# sourceMappingURL=analytics.mjs.map