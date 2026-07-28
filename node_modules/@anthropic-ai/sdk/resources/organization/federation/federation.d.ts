import { APIResource } from "../../../core/resource.js";
import * as IssuersAPI from "./issuers.js";
import { FederationIssuer, FederationIssuerPollStatus, FederationIssuersPageCursor, IssuerCreateParams, IssuerListParams, IssuerUpdateParams, Issuers, JWKSDiscovery, JWKSExplicitURL, JWKSInline } from "./issuers.js";
import * as RulesAPI from "./rules/rules.js";
import { FederationRule, FederationRuleMatch, FederationRuleWorkspace, FederationRulesPageCursor, RuleCreateParams, RuleListParams, RuleUpdateParams, Rules, ServiceAccountTarget } from "./rules/rules.js";
export declare class Federation extends APIResource {
    issuers: IssuersAPI.Issuers;
    rules: RulesAPI.Rules;
}
export declare namespace Federation {
    export { Issuers as Issuers, type FederationIssuer as FederationIssuer, type FederationIssuerPollStatus as FederationIssuerPollStatus, type JWKSDiscovery as JWKSDiscovery, type JWKSExplicitURL as JWKSExplicitURL, type JWKSInline as JWKSInline, type FederationIssuersPageCursor as FederationIssuersPageCursor, type IssuerCreateParams as IssuerCreateParams, type IssuerUpdateParams as IssuerUpdateParams, type IssuerListParams as IssuerListParams, };
    export { Rules as Rules, type FederationRule as FederationRule, type FederationRuleMatch as FederationRuleMatch, type FederationRuleWorkspace as FederationRuleWorkspace, type ServiceAccountTarget as ServiceAccountTarget, type FederationRulesPageCursor as FederationRulesPageCursor, type RuleCreateParams as RuleCreateParams, type RuleUpdateParams as RuleUpdateParams, type RuleListParams as RuleListParams, };
}
//# sourceMappingURL=federation.d.ts.map