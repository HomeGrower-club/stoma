/**
 * Generates a self-contained HTML page that relays OAuth callback
 * query parameters to the playground opener window via postMessage.
 *
 * Served by `wrapWithPlayground` when a browser navigates to a
 * callback route (e.g., after the OAuth provider redirects the popup).
 */
export function oauthRelayHtml(url: URL): string {
  const paramsJson = JSON.stringify(
    Object.fromEntries(url.searchParams.entries())
  ).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>Authorization Complete</title></head>
<body style="font-family:system-ui;padding:2rem;text-align:center;background:#1e1e1e;color:#d4d4d4">
<h3>Authorization Complete</h3>
<p id="msg">Sending parameters to the playground\u2026</p>
<script>
(function() {
  var params = ${paramsJson};
  if (window.opener) {
    window.opener.postMessage({ type: "stoma-oauth-callback", params: params }, location.origin);
    document.getElementById("msg").textContent = "Parameters sent. You can close this window.";
  } else {
    document.getElementById("msg").textContent = "No opener window found. Please copy the URL and paste it into the playground manually.";
  }
})();
</script>
</body>
</html>`;
}
