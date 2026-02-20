import { describe, expect, it } from "vitest";
import { oauthRelayHtml } from "../oauth-relay.js";

describe("oauthRelayHtml", () => {
  it("produces valid HTML document", () => {
    const html = oauthRelayHtml(new URL("http://localhost/callback?code=abc"));
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  it("embeds query params as JSON in the output", () => {
    const html = oauthRelayHtml(
      new URL("http://localhost/callback?code=abc&state=xyz123")
    );
    expect(html).toContain('"code":"abc"');
    expect(html).toContain('"state":"xyz123"');
  });

  it("always uses stoma-oauth-callback as the postMessage type", () => {
    const html = oauthRelayHtml(new URL("http://localhost/callback?x=1"));
    expect(html).toContain('"stoma-oauth-callback"');
  });

  // XSS prevention invariant: < must be escaped to prevent script injection
  // via crafted query parameters like ?code=<script>alert(1)</script>
  it("escapes < characters in params to prevent XSS", () => {
    const html = oauthRelayHtml(
      new URL(
        "http://localhost/callback?code=" +
          encodeURIComponent('<script>alert("xss")</script>')
      )
    );
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("\\u003c");
  });
});
