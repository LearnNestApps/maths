"""Sign-in-required flows for the Uplore home page + Maths, with a stand-in Supabase (Playwright route).
Needs a clone of getuplore/getuplore.github.io next to this repo (or set HUB=/path/to/it), and Chrome.
Run after ./build.sh:  python3 tests/flows_signin.py"""
import json, os, re, sys, threading, time, functools, http.server, socketserver, urllib.parse, itertools
from playwright.sync_api import sync_playwright

import tempfile
MATHS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUB = os.environ.get('HUB') or os.path.join(os.path.dirname(MATHS), 'getuplore.github.io')
CHROME = os.environ.get('CHROME', '/usr/bin/google-chrome')
SITE = tempfile.mkdtemp(prefix='uplore-site-')
for name, target in (('index.html', os.path.join(HUB, 'index.html')), ('maths', MATHS)):
    p = os.path.join(SITE, name)
    if not os.path.lexists(p): os.symlink(target, p)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=SITE)); srv.daemon_threads = True
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{srv.server_address[1]}/'

# ---------- stand-in Supabase ----------
SB = 'https://kafkrkcuogvurfhigksk.supabase.co'
n = itertools.count(1)
class Fake:
    def __init__(s):
        s.users = {'one@x.io': {'id': 'u1', 'pw': 'password1'}, 'none@x.io': {'id': 'u2', 'pw': 'password1'}}
        s.access, s.refresh = {}, {}
        s.learners = {'u1': [{'id': 'pA', 'name': 'Asha', 'deleted': False, 'data': {'age': 19, 'lang': 'en', 'color': '#ff8a3d', 'progress': {}, 'bests': {}, 'coins': 0, 'stickers': [], 't': 1}}], 'u2': []}
        s.families = {'u1': {'region': 'uk'}, 'u2': {}}
        s.log = []
    def session(s, uid):
        a, r = f'acc{next(n)}', f'ref{next(n)}'; s.access[a] = uid; s.refresh[r] = uid
        email = next(e for e, u in s.users.items() if u['id'] == uid)
        return {'access_token': a, 'refresh_token': r, 'expires_in': 3600, 'expires_at': int(time.time()) + 3600, 'user': {'id': uid, 'email': email}}
F = Fake()

def handle(route):
    req = route.request
    hdr = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', 'Content-Type': 'application/json'}
    if req.method == 'OPTIONS': return route.fulfill(status=204, headers=hdr)
    u = urllib.parse.urlparse(req.url); q = urllib.parse.parse_qs(u.query); path = u.path
    body = json.loads(req.post_data) if req.post_data else None
    tok = (req.headers.get('authorization') or '').replace('Bearer ', '')
    uid = F.access.get(tok)
    F.log.append((req.method, path, q.get('grant_type', [''])[0], bool(uid)))
    def ok(d, st=200): route.fulfill(status=st, headers=hdr, body=json.dumps(d) if d is not None else '')
    def err(st, msg): route.fulfill(status=st, headers=hdr, body=json.dumps({'error': msg, 'msg': msg}))
    if path == '/auth/v1/token':
        if q['grant_type'][0] == 'password':
            us = F.users.get(body['email'])
            return ok(F.session(us['id'])) if us and us['pw'] == body['password'] else err(400, 'Invalid login credentials')
        r = F.refresh.pop(body['refresh_token'], None)
        return ok(F.session(r)) if r else err(400, 'Invalid Refresh Token: Already Used')
    if path == '/auth/v1/logout': return ok(None, 204)
    if not uid: return err(401, 'JWT expired')
    if path == '/auth/v1/user': return ok(F.session(uid)['user'])
    if path == '/rest/v1/learners':
        if req.method == 'GET': return ok([dict(r) for r in F.learners[uid]])
        for row in body:
            F.learners[uid] = [r for r in F.learners[uid] if r['id'] != row['id']] + [{k: row[k] for k in ('id', 'name', 'data', 'deleted')}]
        return ok(None, 201)
    if path == '/rest/v1/families':
        if req.method == 'GET': return ok([{'settings': F.families.get(uid, {})}])
        F.families[uid] = body[0]['settings']; return ok(None, 201)
    if path == '/rest/v1/rpc/is_admin': return ok(False)
    return err(404, 'not found ' + path)

# ---------- checks ----------
results = []
def check(name, cond):
    results.append((name, bool(cond))); print(('PASS ' if cond else 'FAIL ') + name)

def hub_signin(page, email):
    page.wait_for_selector('#sheet:not([hidden]) #em', timeout=5000) if page.is_visible('#sheet:not([hidden]) #em') else page.click('#sin')
    page.fill('#em', email); page.fill('#pw', 'password1'); page.click('#f .go')

def wait_path(pg, path, timeout=5000):
    pg.wait_for_function(f"location.pathname === '{path}' && document.readyState === 'complete'", timeout=timeout)

def run(size):
    global F
    F = Fake()
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path=CHROME, args=['--no-sandbox'])
        ctx = br.new_context(viewport=size)
        ctx.route(SB + '/**', handle)
        errors = []
        def watch(pg): pg.on('pageerror', lambda e: errors.append(str(e)))
        ctx.on('page', watch)
        tag = f"[{size['width']}] "

        # 1. Signed out: /maths/ sends you to the home page with the sign-in box open.
        p = ctx.new_page()
        p.goto(BASE + 'maths/'); p.wait_for_url(BASE + '#signin', timeout=5000) if False else wait_path(p, '/', timeout=5000)
        p.wait_for_selector('#sheet:not([hidden]) #em')
        check(tag + 'signed out: /maths/ goes to the home page', p.url.rstrip('/') + '/' == BASE)
        check(tag + 'home page shows "Please sign in to open Maths"', 'Please sign in to open Maths' in p.inner_text('#msg'))
        check(tag + 'address is cleaned (no #signin left)', '#' not in p.url)
        check(tag + 'no guest onboarding stored', p.evaluate("JSON.parse(localStorage.getItem('pipmaths.v1')||'{\"profiles\":[]}').profiles.length") == 0)

        # 2. Sign in there → straight back into Maths, with the learner from the account.
        hub_signin(p, 'one@x.io')
        wait_path(p, '/maths/', timeout=5000)
        p.wait_for_selector('.home .htop', timeout=8000)
        check(tag + 'after sign-in, back in Maths on the home screen', 'Asha' in p.inner_text('.htop'))
        p.wait_for_timeout(int(1 * 1000)); link = p.query_selector('.htop .uplink')
        check(tag + '"← Uplore" link in the Maths header', link and link.inner_text().strip() == '← Uplore')
        check(tag + '"← Uplore" points to the home page', link and p.evaluate("a => a.href", link) == BASE)
        box = p.locator('.htop .uplink').bounding_box()
        check(tag + '"← Uplore" link is on screen and tappable', box and box['height'] >= 40 and box['x'] >= 0 and box['x'] + box['width'] <= size['width'])

        # 3. Home page in another tab adds a learner → Maths tab sees it without reloading.
        h = ctx.new_page(); h.goto(BASE); h.wait_for_selector('#addl')
        h.click('#addl'); h.fill('#nm', 'Ravi'); h.click('#ag button[data-a="9"]'); h.click('#f .go')
        p.bring_to_front(); p.evaluate("document.dispatchEvent(new Event('visibilitychange'))")
        p.click('.htop .who'); p.wait_for_selector('.lrs')
        check(tag + 'two tabs: learner added on home page shows up in open Maths', 'Ravi' in p.inner_text('.lrs'))
        check(tag + 'two tabs: Maths keeps its own current learner', 'Asha' in p.inner_text('.lr.on'))
        p.click('.sclose')
        p.wait_for_timeout(int(0.5 * 1000))
        check(tag + 'new learner backed up to the account', any(r['name'] == 'Ravi' for r in F.learners['u1']))

        # 4. Token renewed in one tab: the other tab uses the new one instead of being signed out.
        for k in list(F.access): F.access.pop(k)          # every access token expires
        old = p.evaluate("JSON.parse(localStorage.getItem('pipmaths.session')).refresh_token")
        p.evaluate("window.dispatchEvent(new Event('online'))")   # Maths tab: sync → 401 → renew
        p.wait_for_function(f"JSON.parse(localStorage.getItem('pipmaths.session')).refresh_token !== '{old}'", timeout=5000)
        p.wait_for_timeout(int(1 * 1000))
        renewed = sum(1 for m, pth, g, a in F.log if g == 'refresh_token')
        q = ctx.new_page(); q.goto(BASE + 'maths/'); q.wait_for_selector('.home .htop, .picker', timeout=8000)
        check(tag + 'session renewed once, second Maths tab stays signed in', renewed == 1 and q.url.startswith(BASE + 'maths/'))
        q.close()

        # 5. Sign out on the home page → open Maths tab returns to the home page.
        h.bring_to_front(); h.click('#out')
        if h.is_visible('#warn'): h.click('#out')
        wait_path(p, '/', timeout=5000); p.wait_for_selector('#hello')
        check(tag + 'two tabs: sign-out on home page sends Maths tab home', p.url.split('#')[0] == BASE)
        check(tag + 'Maths tab now shows the signed-out home page', 'Welcome to Uplore' in p.inner_text('#hello'))

        # 6. Family with no learners: stays on the home page to add one.
        p.click('#sin') if not p.is_visible('#sheet:not([hidden]) #em') else None
        p.fill('#em', 'none@x.io'); p.fill('#pw', 'password1'); p.click('#f .go')
        p.wait_for_selector('#addl', timeout=5000)
        check(tag + 'no learners yet: stays on the home page with "Add a learner"', p.url.split('#')[0] == BASE)
        h.close()

        # 7. Session ends while Maths is open (renewal refused) → home page, "please sign in again".
        p.goto(BASE); p.click('#out')
        p.click('#sin'); p.fill('#em', 'one@x.io'); p.fill('#pw', 'password1'); p.click('#f .go'); p.wait_for_selector('.chip[data-id]')
        p.goto(BASE + 'maths/'); p.wait_for_selector('.home .htop, .picker', timeout=8000)
        p.wait_for_timeout(1200)   # let the first sync finish, so the next one meets the expired session
        F.access.clear(); F.refresh.clear()
        p.evaluate("window.dispatchEvent(new Event('online'))")
        wait_path(p, '/', timeout=6000); p.wait_for_selector('#sheet:not([hidden]) #msg')
        check(tag + 'expired session: back on home page', True)
        check(tag + 'expired session: "Your sign-in has ended. Please sign in again."', 'sign in again' in p.inner_text('#msg'))
        check(tag + 'expired session: session removed from the device', p.evaluate("localStorage.getItem('pipmaths.session')") is None)

        # 8. Sign out inside Maths (Grown-ups → Family account) → home page, signed out.
        hub_signin(p, 'one@x.io'); wait_path(p, '/maths/', timeout=5000)
        p.wait_for_selector('.home .htop, .picker', timeout=8000)
        if p.is_visible('.picker'): p.click('.pcard[data-p="pA"]')
        p.click('.htop .gear')   # Asha is a grown-up, so no grown-ups sum
        p.wait_for_selector('.gsignout'); p.click('.gsignout')   # everything is backed up, so one tap
        wait_path(p, '/', timeout=6000)
        check(tag + 'sign out in Maths returns to the home page', 'Welcome to Uplore' in p.inner_text('#hello'))
        check(tag + 'sign out in Maths: no "sign in again" message', p.is_hidden('#sheet'))
        check(tag + 'sign out in Maths: learners cleared', p.evaluate("JSON.parse(localStorage.getItem('pipmaths.v1')).profiles.length") == 0)

        # 9. Old email link that lands on /maths/ still signs in (and offers to add a learner).
        s = F.session('u2')
        p.goto(BASE + f"maths/#access_token={s['access_token']}&refresh_token={s['refresh_token']}&expires_in=3600&type=signup")
        p.wait_for_selector('section.ob', timeout=8000); p.wait_for_timeout(int(0.8 * 1000))
        check(tag + 'old /maths/ email link: stays in Maths, signed in', p.url.startswith(BASE + 'maths/') and p.evaluate("!!localStorage.getItem('pipmaths.session')"))
        txt = p.inner_text('section.ob')
        check(tag + 'old /maths/ email link: add-a-learner screen, no guest sign-in button', 'Who is learning?' in txt and 'family account: sign in' not in txt)
        check(tag + 'onboarding has the "← Uplore" link', p.is_visible('section.ob > .uplink'))
        p.fill('#obname', 'Mo'); p.click('.ab[data-a="6"]')
        if p.is_visible('.rg'): p.click('.rg[data-r="uk"]')
        p.click('.obgo'); p.wait_for_selector('.home .htop')
        for _ in range(40):
            if any(r['name'] == 'Mo' for r in F.learners['u2']): break
            p.wait_for_timeout(int(0.25 * 1000))
        check(tag + 'learner added in Maths is backed up', any(r['name'] == 'Mo' for r in F.learners['u2']))

        p.click('.upnext'); p.wait_for_function("!document.querySelector('#app > section.home')", timeout=6000)
        check(tag + 'a lesson still opens when signed in', p.evaluate("document.querySelector('#app').children.length") > 0)
        check(tag + 'no script errors', not errors)
        if errors: print(errors)
        br.close()

for sz in ({'width': 1024, 'height': 768}, {'width': 390, 'height': 844}):
    run(sz)
# Static wording checks
priv = open(os.path.join(MATHS, 'privacy.html')).read(); i18n = open(os.path.join(MATHS, 'js/core/i18n.js')).read()
check('privacy page no longer says it works without an account', 'without an account' not in priv)
check('no "Everything works without an account" / guest wording in app text', 'without an account' not in i18n and 'Optional.' not in i18n)
bad = [r for r in results if not r[1]]
print(f'\n{len(results) - len(bad)}/{len(results)} checks pass')
sys.exit(1 if bad else 0)
