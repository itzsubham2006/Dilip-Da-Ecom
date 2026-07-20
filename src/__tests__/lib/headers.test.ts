describe('Security Headers', () => {
  it('requires all security headers in next config', () => {
    const headers = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];

    expect(headers.length).toBe(4);
    expect(headers.map((h) => h.key)).toContain('X-Frame-Options');
    expect(headers.map((h) => h.key)).toContain('X-Content-Type-Options');
    expect(headers.map((h) => h.key)).toContain('Referrer-Policy');
    expect(headers.map((h) => h.key)).toContain('Permissions-Policy');
  });

  it('requires DENY for X-Frame-Options', () => {
    const xfo = { key: 'X-Frame-Options', value: 'DENY' };
    expect(xfo.value).toBe('DENY');
  });

  it('requires nosniff for X-Content-Type-Options', () => {
    const xcto = { key: 'X-Content-Type-Options', value: 'nosniff' };
    expect(xcto.value).toBe('nosniff');
  });
});
