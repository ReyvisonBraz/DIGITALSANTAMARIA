/**
 * @module constants
 * @description Barrel export de todas as constantes da aplicação.
 */

export {
  NAV_LINKS,
  BOTTOM_NAV_ITEMS,
  DASHBOARD_MODULES,
  FOOTER_LINKS,
} from './navigation';

export type {
  NavLink,
  BottomNavItem,
  DashboardModule,
} from './navigation';

export { DEMAND_STATUS_LABEL, REPORT_STATUS_LABEL, OPEN_DEMAND_STATUSES, OPEN_REPORT_STATUSES, canCitizenCancelReport, canCitizenCancelDemand, isDemandClosed, isReportClosed } from './protocols';

export { FEATURE_STATUS, SUSPENDED_ROUTES, isRouteSuspended, getFeatureStatus, getFeaturesByStatus, getAdminTabFeatures, getIncompleteFeatures } from './feature-status';
export type { FeatureStatus, FeatureEntry } from './feature-status';

export { BUSINESS_CATEGORIES, BUSINESS_CATEGORY_LABEL, BUSINESS_CATEGORY_ACCENT, GENERIC_BUSINESS_LOGOS, getBusinessCategoryLabel } from './businesses';
