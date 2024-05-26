export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/proxy/')) {
      const proxyUrl = atob(url.pathname.replace('/proxy/',''));
      const proxyData = {
        status:request.status,
        statusText:request.statusText,
        headers:request.headers
      }
      const proxy = await fetch(proxyUrl,proxyData);
      const responseData = {
        status:proxy.status,
        statusText:proxy.statusText,
        headers:proxy.headers
      }
      return new Response(proxy.body,responseData);
    }
    else return new Response('Wrong path',{status:404});
  },
};
