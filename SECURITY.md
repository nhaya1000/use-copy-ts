# Security Policy

## Supported Versions
We actively support the latest minor of `use-copy-ts`.

| Version | Supported |
|--------:|:---------:|
| 0.x.x   | ✅        |

> Policy: We generally support only the **latest released 0.x**. When a new 0.x is released, the previous minor may be supported for up to 30 days for critical fixes.

---

## Reporting a Vulnerability

### Private Channels (preferred)
- **GitHub Security Advisory (Private):** Create a draft advisory in this repo.
- **Email:** security@your-domain.example  
  (Optionally) PGP: `FINGERPRINT HERE`, key: https://your-domain.example/pgp.txt

Please include:
- A clear **description** and **security impact**
- **Steps to reproduce** (minimal repro code if possible)
- **Environment**: OS, Browser (and version), Node/React versions, package version
- Any **workarounds/mitigations** you found

**Do NOT** open public issues for vulnerabilities.

### Our Triage & Timeline (SLO)
- **Ack**: within **48 hours**
- **Initial assessment**: within **7 days**
- **Fix targets** (guideline):
  - Critical: patch within **7 days**
  - High: within **14 days**
  - Medium: next scheduled release
  - Low: best effort

We’ll keep you updated through the private advisory or email.

---

## Coordinated Disclosure

- We ask that you **withhold public disclosure** until a fix is released and users have had a reasonable update window.
- After release, we will publish a **GitHub Security Advisory (GHSA)** and, when applicable, request a **CVE**.
- We can **credit reporters** (with permission). If you prefer to remain anonymous, we will respect that.
- No bounty program at this time.

---

## Scope

### In Scope
- Vulnerabilities in this repository’s source and published npm package(s)
- Build artifacts we publish (`dist/*`)

### Out of Scope
- Denial of Service via excessive usage patterns in consumer apps
- Social engineering, physical attacks, issues in **third-party** services or dependencies
- Vulnerabilities requiring privileged or local system access beyond normal package usage

---

## Security Considerations for Clipboard

This library wraps Clipboard operations and therefore:

- **Secure Context**: Most browsers require HTTPS or `http://localhost`.
- **User Activation/Permission**: Some environments require a user gesture and/or permission; calls may **reject** if not satisfied.
- **Privacy**: Avoid placing secrets (tokens/passwords) on the clipboard; consider redaction.
- **Fallbacks**: Environments may lack `navigator.clipboard`. Consumers should handle **graceful failure** and inform users.

Browser behavior varies (e.g., iOS/Safari). Always implement **error handling** and **feature detection**.

---

## Supply Chain & Releases

- We publish release notes and prefer **signed tags** and **provenance-enabled** npm releases when possible.
- We track and patch known-vulnerable dependencies in a timely manner.
- If you find a supply-chain issue (typosquatting, compromised dependency, etc.), please use the private channels above.

---

## Reporter Hall of Fame

We’re happy to acknowledge reporters after coordinated disclosure (opt-in). Thank you for helping keep `use-copy-ts` secure!
