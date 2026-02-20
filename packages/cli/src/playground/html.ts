import type { GatewayRegistry } from "../gateway/types.js";

export function playgroundHtml(registry: GatewayRegistry): string {
  const registryJson = JSON.stringify(registry).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(registry.gatewayName)} — Stoma Playground</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#1e1e1e;--bg2:#252526;--bg3:#2d2d2d;
  --border:#3c3c3c;--text:#d4d4d4;--muted:#969696;--dim:#555;
  --teal:#4ec9b0;--blue:#0e639c;--blue2:#1177bb;
  --yellow:#dcdcaa;--red:#f48771;--blue-text:#569cd6;
  --mono:"Cascadia Code","Fira Code","JetBrains Mono","SF Mono",monospace;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--sans)}
body{display:flex;flex-direction:column;overflow:hidden}

/* Header */
.hdr{display:flex;align-items:center;justify-content:space-between;height:3rem;padding:0 1rem;background:var(--bg2);border-bottom:1px solid var(--border);flex-shrink:0}
.hdr-left{display:flex;align-items:center;gap:.5rem}
.logo{font-weight:700;font-size:.875rem;color:var(--teal);text-decoration:none}
.hdr-div{color:var(--dim);font-size:.875rem}
.hdr-title{font-size:.8125rem;color:var(--muted)}

/* Routes bar */
.routes-bar{padding:.5rem 1rem;display:flex;flex-wrap:wrap;gap:.25rem;flex-shrink:0;border-bottom:1px solid var(--border);background:var(--bg)}
.chip{all:unset;display:inline-flex;align-items:center;gap:.375rem;height:1.5rem;padding:0 .5rem;border-radius:.25rem;border:1px solid var(--border);background:var(--bg3);font-family:var(--mono);font-size:.6875rem;cursor:pointer;user-select:none;transition:border-color .15s,background .15s}
.chip:hover{border-color:var(--blue);background:#333}
.method{font-size:.5625rem;font-weight:700;letter-spacing:.04em;padding:.0625rem .25rem;border-radius:.125rem}
.m-get{background:var(--teal);color:var(--bg)}
.m-post{background:var(--blue-text);color:#fff}
.m-put,.m-patch{background:var(--yellow);color:var(--bg)}
.m-delete{background:var(--red);color:var(--bg)}

/* Workspace — two pane split */
.workspace{flex:1;display:flex;gap:.75rem;padding:.75rem 1rem;overflow:hidden}
.pane-left{flex:1;display:flex;flex-direction:column;gap:.625rem;overflow-y:auto;min-width:0}
.pane-right{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}

/* Token Store */
.token-store{border:1px solid var(--border);border-radius:.25rem;background:var(--bg2);overflow:hidden;flex-shrink:0}
.token-header{display:flex;align-items:center;justify-content:space-between;padding:.375rem .625rem;background:var(--bg3);border-bottom:1px solid var(--border)}
.token-title{font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
.token-item{display:flex;align-items:center;gap:.375rem;padding:.25rem .625rem;border-bottom:1px solid rgba(60,60,60,.2)}
.token-item:last-child{border-bottom:none}
.token-name{font-size:.6875rem;font-family:var(--mono);color:var(--teal);min-width:6rem;flex-shrink:0}
.token-val{font-size:.6875rem;font-family:var(--mono);color:var(--dim);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.token-actions{display:flex;gap:.25rem;flex-shrink:0}
.token-btn{all:unset;display:inline-flex;align-items:center;height:1.25rem;padding:0 .375rem;border-radius:.1875rem;font-size:.5625rem;font-weight:600;cursor:pointer;transition:background .15s;user-select:none}
.token-btn-use{background:var(--blue);color:#fff}
.token-btn-use:hover{background:var(--blue2)}
.token-btn-del{background:var(--bg3);color:var(--muted);border:1px solid var(--border)}
.token-btn-del:hover{background:#3a3a3a}

/* Form */
.form-row{display:flex;gap:.375rem}
.sel{width:5.5rem;height:1.75rem;padding:0 .375rem;border-radius:.25rem;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:.75rem;font-family:var(--mono);cursor:pointer;outline:none;flex-shrink:0}
.sel:focus{border-color:var(--blue)}
.inp{flex:1;height:1.75rem;padding:0 .5rem;border-radius:.25rem;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:.75rem;font-family:var(--mono);outline:none;min-width:0}
.inp:focus{border-color:var(--blue)}
.btn{all:unset;display:inline-flex;align-items:center;height:1.75rem;padding:0 .75rem;border-radius:.25rem;background:var(--blue);color:#fff;font-size:.75rem;font-weight:600;cursor:pointer;transition:background .15s;user-select:none;white-space:nowrap}
.btn:hover{background:var(--blue2)}
.btn:disabled{opacity:.4;cursor:not-allowed}

.form-sections{display:flex;flex-direction:column;gap:.375rem;margin-top:.375rem}
.field{display:flex;flex-direction:column;gap:.125rem}
.lbl{font-size:.5625rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
.lbl-row{display:flex;align-items:center;justify-content:space-between}
.sm-btn{all:unset;font-size:.5625rem;font-weight:600;color:var(--blue-text);cursor:pointer;user-select:none}
.sm-btn:hover{text-decoration:underline}
.ta{width:100%;padding:.375rem .5rem;border-radius:.25rem;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:.6875rem;font-family:var(--mono);line-height:1.4;resize:vertical;outline:none;flex:1;min-height:3.5rem}
.ta:focus{border-color:var(--blue)}
.ta::placeholder{color:var(--dim)}

/* Header rows */
.hdr-rows{display:flex;flex-direction:column;gap:.25rem}
.hdr-row{display:flex;gap:.25rem;align-items:center}
.hdr-input{height:1.5rem;padding:0 .375rem;border-radius:.25rem;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:.6875rem;font-family:var(--mono);outline:none}
.hdr-input:focus{border-color:var(--blue)}
.hdr-name{width:10rem;flex-shrink:0}
.hdr-val{flex:1;min-width:0}
.hdr-del{all:unset;display:inline-flex;align-items:center;justify-content:center;width:1.5rem;height:1.5rem;border-radius:.25rem;font-size:.75rem;color:var(--dim);cursor:pointer;flex-shrink:0}
.hdr-del:hover{color:var(--red);background:rgba(244,135,113,.1)}

/* Callback Banner */
.callback-banner{padding:.625rem .75rem;background:#1a2332;border:1px solid var(--blue-text);border-radius:.25rem;font-size:.75rem;color:var(--blue-text);flex-shrink:0}
.callback-banner strong{color:#fff}

/* Response panel */
.res{flex:1;display:flex;flex-direction:column;border:1px solid var(--border);border-radius:.25rem;background:var(--bg2);overflow:hidden}
.res-empty{padding:2rem;text-align:center;color:var(--dim);font-size:.8125rem}
.res-top{display:flex;align-items:center;gap:.75rem;padding:.5rem .75rem;background:var(--bg2);border-bottom:1px solid var(--border);flex-shrink:0}
.badge{display:inline-flex;align-items:center;height:1.25rem;padding:0 .375rem;border-radius:.1875rem;font-family:var(--mono);font-size:.6875rem;font-weight:700;line-height:1}
.b-2xx{background:var(--teal);color:var(--bg)}
.b-3xx{background:var(--blue-text);color:#fff}
.b-4xx{background:var(--yellow);color:var(--bg)}
.b-5xx{background:var(--red);color:var(--bg)}
.timing{font-size:.75rem;font-family:var(--mono);color:var(--muted)}

/* Response tabs */
.res-tabs{display:flex;background:var(--bg3);border-bottom:1px solid var(--border);flex-shrink:0}
.res-tab{all:unset;padding:.375rem .75rem;font-size:.6875rem;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;user-select:none}
.res-tab:hover{color:var(--text)}
.res-tab.active{color:var(--teal);border-bottom-color:var(--teal)}
.res-tab-count{font-weight:400;color:var(--dim);margin-left:.25rem}

/* Tab content */
.res-tab-content{flex:1;overflow:auto;display:none}
.res-tab-content.active{display:block}
.res-body{padding:.5rem .75rem}
.res-body pre{font-family:var(--mono);font-size:.6875rem;line-height:1.5;white-space:pre-wrap;word-break:break-word;margin:0}
.htable{width:100%;border-collapse:collapse;font-size:.6875rem;font-family:var(--mono)}
.htable td{padding:.25rem .75rem;border-bottom:1px solid rgba(60,60,60,.2);vertical-align:top}
.htable td:first-child{color:var(--muted);white-space:nowrap;width:1%;padding-right:.375rem}
.htable td:last-child{word-break:break-all}

.res-error{padding:1rem;color:var(--red);font-family:var(--mono);font-size:.8125rem;text-align:center;word-break:break-word}

/* Redirect banner (OAuth) */
.res-redirect{padding:.75rem;background:#1a2332;border-bottom:1px solid var(--border);flex-shrink:0}
.res-redirect-title{font-size:.75rem;font-weight:700;color:var(--blue-text);margin-bottom:.25rem}
.res-redirect-url{font-size:.6875rem;font-family:var(--mono);color:var(--muted);word-break:break-all;margin-bottom:.5rem}
.res-redirect-btn{all:unset;display:inline-flex;align-items:center;height:1.5rem;padding:0 .625rem;border-radius:.25rem;background:var(--blue-text);color:#fff;font-size:.6875rem;font-weight:600;cursor:pointer;transition:background .15s;user-select:none}
.res-redirect-btn:hover{background:#3d8fd6}
.res-redirect-notice{font-size:.5625rem;color:var(--dim);margin-top:.375rem}

/* JSON syntax highlighting */
.j-key{color:#9cdcfe}
.j-str{color:#ce9178}
.j-num{color:#b5cea8}
.j-lit{color:#569cd6}
</style>
</head>
<body>

<header class="hdr">
  <div class="hdr-left">
    <span class="logo">Stoma</span>
    <span class="hdr-div">/</span>
    <span class="hdr-title" id="gw-name"></span>
  </div>
</header>

<div class="routes-bar" id="routes"></div>

<div class="workspace">
  <!-- Left pane: request -->
  <div class="pane-left">
    <div class="token-store" id="token-store" style="display:none">
      <div class="token-header">
        <span class="token-title">Saved Tokens</span>
        <button class="sm-btn" id="clear-tokens" type="button">Clear All</button>
      </div>
      <div id="token-list"></div>
    </div>

    <form id="form" autocomplete="off">
      <div class="form-row">
        <select class="sel" id="method">
          <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
        </select>
        <input class="inp" id="path" placeholder="/path" value="/" />
        <button class="btn" type="submit" id="send">Send</button>
      </div>
      <div class="form-sections">
        <div class="field">
          <div class="lbl-row">
            <label class="lbl">Headers</label>
            <button class="sm-btn" id="add-header" type="button">+ Add</button>
          </div>
          <div class="hdr-rows" id="header-rows"></div>
        </div>
        <div class="field" style="flex:1;display:flex;flex-direction:column">
          <label class="lbl" for="body">Body</label>
          <textarea class="ta" id="body" placeholder='{"key":"value"}'></textarea>
        </div>
      </div>
    </form>

    <div class="callback-banner" id="callback-banner" style="display:none"></div>
  </div>

  <!-- Right pane: response -->
  <div class="pane-right">
    <div class="res" id="response">
      <div class="res-empty">Send a request to see the response</div>
    </div>
  </div>
</div>

<script>
var registry = ${registryJson};
document.getElementById("gw-name").textContent = registry.gatewayName || "Playground";

// ── Route chips ──

var routesEl = document.getElementById("routes");
for (var ri = 0; ri < registry.routes.length; ri++) {
  var route = registry.routes[ri];
  for (var mi = 0; mi < route.methods.length; mi++) {
    (function(m, path) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.innerHTML = '<span class="method m-' + m.toLowerCase() + '">' + m + '</span><span>' + esc(path) + '</span>';
      chip.onclick = function() {
        document.getElementById("method").value = m;
        document.getElementById("path").value = path;
        document.getElementById("form").requestSubmit();
      };
      routesEl.appendChild(chip);
    })(route.methods[mi], route.path.replace(/\\*$/, ""));
  }
}

// ── Header table management ──

var headerRowsEl = document.getElementById("header-rows");

function addHeaderRow(name, value) {
  var row = document.createElement("div");
  row.className = "hdr-row";
  var nameInp = document.createElement("input");
  nameInp.className = "hdr-input hdr-name";
  nameInp.placeholder = "Header name";
  nameInp.value = name || "";
  var valInp = document.createElement("input");
  valInp.className = "hdr-input hdr-val";
  valInp.placeholder = "Value";
  valInp.value = value || "";
  var del = document.createElement("button");
  del.type = "button";
  del.className = "hdr-del";
  del.textContent = "\\u00d7";
  del.onclick = function() { row.remove(); };
  row.appendChild(nameInp);
  row.appendChild(valInp);
  row.appendChild(del);
  headerRowsEl.appendChild(row);
  return row;
}

function getHeaders() {
  var headers = {};
  var rows = headerRowsEl.querySelectorAll(".hdr-row");
  for (var i = 0; i < rows.length; i++) {
    var inputs = rows[i].querySelectorAll("input");
    var n = inputs[0].value.trim();
    var v = inputs[1].value.trim();
    if (n) headers[n] = v;
  }
  return headers;
}

function setHeader(name, value) {
  var rows = headerRowsEl.querySelectorAll(".hdr-row");
  var lowerName = name.toLowerCase();
  for (var i = 0; i < rows.length; i++) {
    var inputs = rows[i].querySelectorAll("input");
    if (inputs[0].value.trim().toLowerCase() === lowerName) {
      inputs[1].value = value;
      return;
    }
  }
  addHeaderRow(name, value);
}

document.getElementById("add-header").onclick = function() { addHeaderRow(); };

// ── Token store (localStorage) ──

var TOKEN_KEY = "stoma-playground-tokens";

function loadTokens() {
  try {
    var raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function persistTokens(tokens) {
  try { localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens)); } catch (e) {}
}

function saveToken(label, value) {
  var tokens = loadTokens();
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].label === label) {
      tokens[i].value = value;
      persistTokens(tokens);
      renderTokenStore();
      return;
    }
  }
  tokens.push({ label: label, value: value });
  persistTokens(tokens);
  renderTokenStore();
}

function removeToken(idx) {
  var tokens = loadTokens();
  tokens.splice(idx, 1);
  persistTokens(tokens);
  renderTokenStore();
}

function clearTokens() {
  persistTokens([]);
  renderTokenStore();
}

function applyToken(idx) {
  var tokens = loadTokens();
  if (tokens[idx]) setHeader("Authorization", "Bearer " + tokens[idx].value);
}

function renderTokenStore() {
  var tokens = loadTokens();
  var storeEl = document.getElementById("token-store");
  var listEl = document.getElementById("token-list");
  if (!tokens.length) {
    storeEl.style.display = "none";
    listEl.innerHTML = "";
    return;
  }
  storeEl.style.display = "";
  var html = "";
  for (var i = 0; i < tokens.length; i++) {
    var shortVal = tokens[i].value.length > 40 ? tokens[i].value.slice(0, 40) + "\\u2026" : tokens[i].value;
    html +=
      '<div class="token-item">' +
        '<span class="token-name">' + esc(tokens[i].label) + '</span>' +
        '<span class="token-val">' + esc(shortVal) + '</span>' +
        '<span class="token-actions">' +
          '<button class="token-btn token-btn-use" data-idx="' + i + '">Use</button>' +
          '<button class="token-btn token-btn-del" data-idx="' + i + '">\\u00d7</button>' +
        '</span>' +
      '</div>';
  }
  listEl.innerHTML = html;
  listEl.querySelectorAll(".token-btn-use").forEach(function(btn) {
    btn.onclick = function() { applyToken(Number(btn.dataset.idx)); };
  });
  listEl.querySelectorAll(".token-btn-del").forEach(function(btn) {
    btn.onclick = function() { removeToken(Number(btn.dataset.idx)); };
  });
}

document.getElementById("clear-tokens").onclick = clearTokens;

// Restore tokens on load
renderTokenStore();
var initTokens = loadTokens();
if (initTokens.length) applyToken(initTokens.length - 1);

// ── Token auto-detection from responses ──

function detectAndSaveTokens(data) {
  if (!data || !data.body) return;
  try {
    var parsed = JSON.parse(data.body);
    var token = parsed.access_token || parsed.token;
    if (typeof token === "string" && token.length > 0) {
      var label = parsed.token_type ? parsed.token_type + "_token" : "access_token";
      saveToken(label, token);
      setHeader("Authorization", "Bearer " + token);
    }
  } catch (e) {}
}

// ── Send request ──
//
// Direct fetch to the gateway (same origin). For redirect responses the
// browser returns an opaque response (redirect:"manual"), so we fall back
// to the server-side proxy which can read the full 3xx details.

function sendViaProxy(method, path, headers, bodyText) {
  return fetch("/__playground/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method: method, path: path, headers: headers, body: bodyText || undefined }),
  }).then(function(proxyRes) {
    if (!proxyRes.ok) {
      return proxyRes.json().catch(function() { return null; }).then(function(err) {
        renderError(err && err.error ? err.error : "Request failed: " + proxyRes.status);
      });
    }
    return proxyRes.json().then(function(data) {
      if (data.error) renderError(data.error);
      else { renderResponse(data); detectAndSaveTokens(data); }
    });
  });
}

document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();
  var callbackBanner = document.getElementById("callback-banner");
  callbackBanner.style.display = "none";

  var method = document.getElementById("method").value;
  var path = document.getElementById("path").value;
  var bodyText = document.getElementById("body").value;
  var sendBtn = document.getElementById("send");
  var headers = getHeaders();

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending\\u2026";

  var start = performance.now();
  var init = { method: method, headers: headers, redirect: "manual" };
  if (bodyText && method !== "GET" && method !== "HEAD") init.body = bodyText;

  fetch(path, init).then(function(res) {
    // Opaque redirect — fall back to proxy for full 3xx details
    if (res.type === "opaqueredirect") return null;

    var status = res.status;
    var statusText = res.statusText;
    var resHeaders = {};
    res.headers.forEach(function(v, k) { resHeaders[k] = v; });

    return res.text().then(function(bodyStr) {
      return { status: status, statusText: statusText, headers: resHeaders, body: bodyStr, elapsed: performance.now() - start };
    });
  }).catch(function() {
    return null;
  }).then(function(data) {
    if (data) {
      renderResponse(data);
      detectAndSaveTokens(data);
      return;
    }
    return sendViaProxy(method, path, headers, bodyText);
  }).catch(function(err) {
    renderError(err.message || "Request failed");
  }).finally(function() {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
  });
});

// ── Render helpers ──

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightJson(prettyStr) {
  var s = escHtml(prettyStr);
  // Keys
  s = s.replace(/"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"s*:/g, '<span class="j-key">"$1"</span>:');
  // String values (after : or in arrays after , or [)
  s = s.replace(/:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"/g, ': <span class="j-str">"$1"</span>');
  // Numbers
  s = s.replace(/:\\s*(-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)/g, ': <span class="j-num">$1</span>');
  // Booleans and null
  s = s.replace(/:\\s*(true|false|null)\\b/g, ': <span class="j-lit">$1</span>');
  return s;
}

function renderResponse(ref) {
  var status = ref.status, statusText = ref.statusText, headers = ref.headers, body = ref.body, elapsed = ref.elapsed;
  var cls = status < 300 ? "b-2xx" : status < 400 ? "b-3xx" : status < 500 ? "b-4xx" : "b-5xx";

  var rawBody = body || "";
  var prettyBody = rawBody;
  var isJson = false;
  try {
    prettyBody = JSON.stringify(JSON.parse(rawBody), null, 2);
    isJson = true;
  } catch (e) {}

  var headerCount = 0;
  var headerRows = "";
  for (var k in headers) {
    if (headers.hasOwnProperty(k)) {
      headerCount++;
      headerRows += "<tr><td>" + esc(k) + "</td><td>" + esc(String(headers[k])) + "</td></tr>";
    }
  }

  // Redirect banner (OAuth flows)
  var redirectBanner = "";
  var locationUrl = headers && headers.location;
  if (status >= 300 && status < 400 && locationUrl && !locationUrl.startsWith("/")) {
    lastRedirectUrl = locationUrl;
    redirectBanner =
      '<div class="res-redirect">' +
        '<div class="res-redirect-title">Redirect Detected</div>' +
        '<div class="res-redirect-url">' + esc(locationUrl) + '</div>' +
        '<button class="res-redirect-btn" onclick="openAuthPopup(lastRedirectUrl)">Open Authorization</button>' +
        '<div class="res-redirect-notice">Opens in a popup. After authorizing, the callback parameters will be sent back here.</div>' +
      '</div>';
  }

  var prettyContent = isJson
    ? highlightJson(prettyBody)
    : escHtml(prettyBody);

  var resEl = document.getElementById("response");
  resEl.innerHTML =
    '<div class="res-top">' +
      '<span class="badge ' + cls + '">' + status + " " + esc(statusText || "") + '</span>' +
      '<span class="timing">' + (elapsed || 0).toFixed(1) + ' ms</span>' +
    '</div>' +
    redirectBanner +
    '<div class="res-tabs">' +
      '<button class="res-tab active" data-tab="pretty">Pretty</button>' +
      '<button class="res-tab" data-tab="raw">Raw</button>' +
      '<button class="res-tab" data-tab="headers">Headers<span class="res-tab-count">(' + headerCount + ')</span></button>' +
    '</div>' +
    '<div class="res-tab-content active" data-tab="pretty"><div class="res-body"><pre>' + prettyContent + '</pre></div></div>' +
    '<div class="res-tab-content" data-tab="raw"><div class="res-body"><pre>' + esc(rawBody) + '</pre></div></div>' +
    '<div class="res-tab-content" data-tab="headers"><table class="htable">' + headerRows + '</table></div>';

  // Tab switching
  resEl.querySelectorAll(".res-tab").forEach(function(tab) {
    tab.onclick = function() {
      var target = tab.dataset.tab;
      resEl.querySelectorAll(".res-tab").forEach(function(t) { t.classList.toggle("active", t.dataset.tab === target); });
      resEl.querySelectorAll(".res-tab-content").forEach(function(c) { c.classList.toggle("active", c.dataset.tab === target); });
    };
  });
}

function renderError(msg) {
  document.getElementById("response").innerHTML = '<div class="res-error">' + esc(msg) + '</div>';
}

function esc(s) {
  var d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

// ── OAuth popup ──

var lastRedirectUrl = "";
var oauthPopup = null;
function openAuthPopup(url) {
  if (oauthPopup && !oauthPopup.closed) oauthPopup.close();
  oauthPopup = window.open(url, "stoma-oauth", "width=600,height=700");
}

window.addEventListener("message", function(event) {
  if (event.origin !== window.location.origin) return;
  if (!event.data || event.data.type !== "stoma-oauth-callback") return;
  var params = event.data.params;
  if (!params) return;

  var callbackPath = "/auth/callback";
  for (var i = 0; i < registry.routes.length; i++) {
    if (registry.routes[i].path.toLowerCase().indexOf("callback") !== -1) {
      callbackPath = registry.routes[i].path;
      break;
    }
  }

  var qs = new URLSearchParams(params).toString();
  document.getElementById("method").value = "GET";
  document.getElementById("path").value = callbackPath + "?" + qs;

  var banner = document.getElementById("callback-banner");
  banner.innerHTML = 'OAuth parameters received. Click <strong>Send</strong> to complete authorization.';
  banner.style.display = "";

  document.getElementById("response").innerHTML =
    '<div class="res-empty">OAuth callback parameters prefilled. Click Send to exchange for a token.</div>';
});
</script>
</body>
</html>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
