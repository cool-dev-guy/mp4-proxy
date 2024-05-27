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
      // a simple hack to bypass cloudflare not loading issue in firefox :)
      const head  = await fetch(proxyUrl,{method:'HEAD'});
      // it does a HEAD request and bypass the cloudflare issue.
      const proxy = await fetch(proxyUrl,proxyData);
      // simple hack to bypass cloudflare. :)
      const headers = new Headers(proxy.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      if (request.headers.get('range')===null||proxy.headers.get('Content-Range')===null){
        headers.set("Accept-Ranges", "bytes")
      }
      // what it does is it mocks a Accept-Ranges to enable 206 partial-content
      const responseData = {
        status:proxy.status,
        statusText:proxy.statusText,
        headers:headers
      }
      return new Response(proxy.body,responseData);
    }
    else if (url.pathname.startsWith('/download/')) {
      const proxyUrl = atob(url.pathname.replace('/download/',''));
      const proxyData = {
        status:request.status,
        statusText:request.statusText,
        headers:request.headers
      }
      // a simple hack to bypass cloudflare not loading issue in firefox :)
      const head  = await fetch(proxyUrl,{method:'HEAD'});
      // it does a HEAD request and bypass the cloudflare issue.
      const proxy = await fetch(proxyUrl,proxyData);
      // simple hack to bypass cloudflare. :)
      const headers = new Headers(proxy.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Content-Disposition','attachment; filename="video.mp4"');
      if (request.headers.get('range')===null||proxy.headers.get('Content-Range')===null){
        headers.set("Accept-Ranges", "bytes")
      }
      // what it does is it mocks a Accept-Ranges to enable 206 partial-content
      const responseData = {
        status:proxy.status,
        statusText:proxy.statusText,
        headers:headers
      }
      return new Response(proxy.body,responseData);
    }
    else return new Response('Wrong path',{status:404});
  },
};
