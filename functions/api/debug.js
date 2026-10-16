// 临时诊断接口：确认 env.DB 绑定是否真实挂载（诊断完即删除）
export async function onRequest({ env }) {
  return Response.json({
    hasDB: typeof env.DB !== 'undefined',
    dbType: typeof env.DB,
    hasToken: typeof env.UPDATE_TOKEN !== 'undefined',
    envKeys: Object.keys(env || {}),
  });
}
