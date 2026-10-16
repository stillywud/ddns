// 已停用：诊断完成后关闭
export async function onRequest() {
  return new Response('Not Found', { status: 404 });
}
