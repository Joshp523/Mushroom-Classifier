// Keeps the app and the model on the phone after the first visit, so it works in the woods with no signal.
// Bump V when you upload a new version (or a retrained model) so phones fetch it.
const V='shroom-v2',ASSETS=['./','index.html','manifest.webmanifest','ort.wasm.min.js','ort-wasm-simd-threaded.wasm','ort-wasm-simd-threaded.mjs','icon-192.png','icon-512.png','apple-touch-icon.png','model.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
// only clear this app's own old caches: other apps on joshp523.github.io share the same cache storage
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('shroom-')&&x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}))))});
