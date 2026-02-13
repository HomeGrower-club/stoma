---
editUrl: false
next: false
prev: false
title: "geoIpFilter"
---

> **geoIpFilter**(`config?`): [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/traffic/geo-ip-filter.ts:43](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/traffic/geo-ip-filter.ts#L43)

Block or allow requests based on geographic country code.

Reads the country from the configured header (default `cf-ipcountry`,
set by Cloudflare). Supports allowlist and denylist modes. Country
sets are pre-computed once at construction time for efficiency.

## Parameters

### config?

[`GeoIpFilterConfig`](/api/policies/interfaces/geoipfilterconfig/)

Country filter rules and mode selection.

## Returns

[`Policy`](/api/index/interfaces/policy/)

A policy at priority 1 (IP_FILTER).

## Example

```ts
// Allow only US, Canada, and UK
geoIpFilter({ mode: "allow", allow: ["US", "CA", "GB"] });

// Block specific countries
geoIpFilter({ deny: ["CN", "RU"] });
```
