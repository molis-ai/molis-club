/** CLUB09-01: the former account API cannot create identities or accept old cookies. */
export function retiredAccountEntry(): Response {
  return Response.json(
    {
      error: {
        code: 'AUTH_ENTRY_RETIRED',
        message: '请使用统一账号登录。',
      },
      loginPath: '/login',
    },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );
}
