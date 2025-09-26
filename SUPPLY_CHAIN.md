# Supply Chain Hardening

- **Container Signing (Cosign, keyless via GitHub OIDC):**
  - ایمیج‌ها پس از build روی GHCR با هویت OIDC امضا می‌شوند.
  - تأیید:
    ```bash
    cosign verify ghcr.io/<org>/<repo>/<name>:latest       --certificate-oidc-issuer https://token.actions.githubusercontent.com       --certificate-identity-regexp "https://github.com/<org>/<repo>/.*"
    ```

- **Provenance (SLSA)**:
  - Provenance به‌صورت attestation با `actions/attest-build-provenance@v1` روی digest ایمیج push می‌شود.
  - رجیستری GHCR قابلیت ذخیرهٔ attestation را دارد.

- **SBOM (SPDX)**:
  - با Syft تولید و به‌عنوان artifact ذخیره می‌شود.

- **Lighthouse Budgets (Main)**:
  - روی `main` آستانه‌ها سخت‌گیرانه هستند (Perf ≥ 0.85، A11y/SEO/Best-Practices ≥ 0.9)،
    و بودجهٔ LCP/CLS و اندازهٔ اسکریپت/کل تعریف شده‌اند.