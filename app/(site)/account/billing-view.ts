import type {
  PlanVersion,
  Subscription,
} from '../../../lib/account/contracts/types';
export const subscriptionStatus = {
  ACTIVE: '生效中',
  SCHEDULED: '尚未生效',
  EXPIRED: '已到期',
  DISABLED: '已停用',
};
export const assignmentEndReason = {
  RELEASED: '已回收',
  REASSIGNED: '已换绑',
  MEMBER_LEFT: '成员退出',
  MEMBER_REMOVED: '成员移除',
};
export function subscriptionPlan(
  subscription: Subscription,
  plans: PlanVersion[],
) {
  return plans.find(
    (plan) =>
      plan.planId === subscription.planId &&
      plan.planVersion === subscription.planVersion,
  );
}
export function seatLabel(
  subscriptionId: string,
  seatTypeId: string,
  subscriptions: Subscription[],
  plans: PlanVersion[],
) {
  const subscription = subscriptions.find(
    (item) => item.subscriptionId === subscriptionId,
  );
  const plan = subscription && subscriptionPlan(subscription, plans);
  return (
    (plan?.name ?? subscriptionId) +
    ' · ' +
    (plan?.seatTypes.find((type) => type.seatTypeId === seatTypeId)?.name ??
      seatTypeId)
  );
}
export function canAssign(
  subscriptionId: string,
  subscriptions: Subscription[],
) {
  const subscription = subscriptions.find(
    (item) => item.subscriptionId === subscriptionId,
  );
  return Boolean(
    subscription &&
    subscription.status === 'ACTIVE' &&
    Date.parse(subscription.startsAt) <= Date.now() &&
    Date.now() < Date.parse(subscription.endsAt),
  );
}
