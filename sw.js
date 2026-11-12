/* موثوق — service worker. Build ba488da294. Never touches localStorage: user marks/stars survive every update. */
var VER='mwq-ba488da294';
var CORE=["./", "index.html", "manifest.webmanifest", "fonts/fonts.css", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.svg", "fonts/amiri-arabic-400-normal.woff2", "fonts/amiri-arabic-700-normal.woff2", "fonts/amiri-latin-400-normal.woff2", "fonts/amiri-latin-700-normal.woff2", "fonts/tajawal-arabic-400-normal.woff2", "fonts/tajawal-arabic-500-normal.woff2", "fonts/tajawal-arabic-700-normal.woff2", "fonts/tajawal-latin-400-normal.woff2", "fonts/tajawal-latin-500-normal.woff2", "fonts/tajawal-latin-700-normal.woff2"];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VER).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k.indexOf('mwq-')===0&&k!==VER;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
function timeout(ms,p){return new Promise(function(ok,no){var t=setTimeout(function(){no(new Error('timeout'));},ms);p.then(function(v){clearTimeout(t);ok(v);},function(x){clearTimeout(t);no(x);});});}
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==self.location.origin)return;
  if(r.mode==='navigate'){
    /* network first (so updates appear at once), cached copy when offline or slow */
    e.respondWith(timeout(4000,fetch(r,{cache:'no-cache'})).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(VER).then(function(c){c.put('index.html',cp);});}
      return res;
    }).catch(function(){return caches.match('index.html');}));
    return;
  }
  e.respondWith(caches.match(r).then(function(hit){
    return hit||fetch(r).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(VER).then(function(c){c.put(r,cp);});}
      return res;
    });
  }));
});
