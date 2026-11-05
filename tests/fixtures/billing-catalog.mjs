// Real central operations create billing state; only external identity delivery is mocked.
export async function makeBillingFixture(central, userId, tenantId, prefix) {
  const personalFeature = prefix + '.personal',
    shared = prefix + '.shared',
    paid = prefix + '.paid',
    seatType = prefix + '-seat',
    planId = prefix + '-plan';
  for (const [featureId, product, name] of [
    [personalFeature, 'CLUB', '个人功能'],
    [shared, 'SHARED', '共同功能'],
    [paid, 'CLUB', '席位功能'],
    [prefix + '.work', 'WORK', 'Work 专属功能'],
  ])
    await central('createFeature', {
      featureId,
      product,
      name,
      reason: 'Isolated billing fixture',
    });
  await central(
    'publishPlanVersion',
    {
      planVersion: 1,
      name: '协作套餐',
      personalFeatureIds: [personalFeature, shared],
      seatTypes: [
        { seatTypeId: seatType, name: '协作席位', featureIds: [shared, paid] },
      ],
      reason: 'Isolated billing fixture',
    },
    { planId },
  );
  const common = {
    planId,
    planVersion: 1,
    startsAt: new Date(Date.now() - 86400000).toISOString(),
    endsAt: new Date(Date.now() + 86400000).toISOString(),
    reason: 'Isolated billing fixture',
  };
  const personal = await central('createSubscription', {
    ...common,
    owner: { kind: 'USER', id: userId },
  });
  const tenant = await central('createSubscription', {
    ...common,
    owner: { kind: 'TENANT', id: tenantId },
    seatQuantities: { [seatType]: 1 },
  });
  return {
    personal,
    tenant,
    features: [personalFeature, shared, paid],
    personalFeature,
    shared,
    paid,
    seatType,
  };
}
