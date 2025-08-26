// Node-friendly test script that preserves cookies between requests

type CookieJar = Record<string, string>;

function parseSetCookie(setCookie: string): { name: string; value: string } | null {
  const [pair] = setCookie.split(';');
  const eqIdx = pair.indexOf('=');
  if (eqIdx === -1) return null;
  const name = pair.slice(0, eqIdx).trim();
  const value = pair.slice(eqIdx + 1).trim();
  return { name, value };
}

function cookieHeader(jar: CookieJar): string {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

async function requestWithCookies(input: string, init: RequestInit = {}, jar: CookieJar = {}): Promise<Response> {
  const headers = new Headers(init.headers || {});
  if (Object.keys(jar).length) headers.set('Cookie', cookieHeader(jar));
  const res = await fetch(input, { ...init, headers });

  // collect Set-Cookie headers
  const setCookie = res.headers.getSetCookie?.() as string[] | undefined;
  // fallback for older Node versions
  const setCookieSingle = res.headers.get('set-cookie');
  const all = setCookie ?? (setCookieSingle ? [setCookieSingle] : []);
  for (const sc of all) {
    const parsed = parseSetCookie(sc);
    if (parsed) jar[parsed.name] = parsed.value;
  }
  return res;
}

async function testAuthFlow() {
  const base = 'http://localhost:3000';
  const jar: CookieJar = {};
  const testEmail = 'test@example.com';
  const testPassword = 'test123456';

  // 1. Login
  console.log('1) Login');
  const loginRes = await requestWithCookies(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  }, jar);
  if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
  const loginData = await loginRes.json();
  console.log('   -> user:', loginData.user);

  // 2. Session
  console.log('2) Session');
  const sessionRes = await requestWithCookies(`${base}/api/auth/session`, {}, jar);
  const sessionData = await sessionRes.json();
  console.log('   -> session:', sessionData);

  // 3. Refresh token
  console.log('3) Refresh token');
  const refreshRes = await requestWithCookies(`${base}/api/auth/refresh-token`, { method: 'POST' }, jar);
  const refreshData = await refreshRes.json();
  console.log('   -> refresh:', refreshData);

  // 4. Logout
  console.log('4) Logout');
  const logoutRes = await requestWithCookies(`${base}/api/auth/logout`, { method: 'POST' }, jar);
  console.log('   -> logout ok:', logoutRes.ok);

  // 5. Session after logout
  console.log('5) Session after logout');
  const finalSessionRes = await requestWithCookies(`${base}/api/auth/session`, {}, jar);
  const finalSessionData = await finalSessionRes.json();
  console.log('   -> final session:', finalSessionData);
}

testAuthFlow().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
