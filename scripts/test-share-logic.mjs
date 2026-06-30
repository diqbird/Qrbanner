/** Logic test for share fallbacks (run with node on server) */
async function testDataUrlBlob() {
  const dataUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const blob = await fetch(dataUrl).then((r) => r.blob());
  const file = new File([blob], 'qr-code.png', { type: blob.type || 'image/png' });
  if (blob.size < 1 || file.size < 1) throw new Error('blob/file empty');
  console.log('PASS dataUrl->blob->file', blob.type, blob.size);
}

function testFallbackOrder() {
  const cases = [
    { canShareFile: true, shortCode: false, expect: 'native-file-share' },
    { canShareFile: false, shortCode: true, canShareUrl: true, expect: 'native-url-share' },
    { canShareFile: false, shortCode: true, canShareUrl: false, clipboard: true, expect: 'copy-link' },
    { canShareFile: false, shortCode: false, clipboardImage: true, expect: 'copy-image' },
    { canShareFile: false, shortCode: false, clipboardImage: false, expect: 'download-fallback' },
  ];
  for (const c of cases) {
    let action = 'download-fallback';
    if (c.canShareFile) action = 'native-file-share';
    else if (c.shortCode && c.canShareUrl) action = 'native-url-share';
    else if (c.shortCode && c.clipboard) action = 'copy-link';
    else if (c.clipboardImage) action = 'copy-image';
    if (action !== c.expect) throw new Error(`fallback mismatch: got ${action} want ${c.expect}`);
  }
  console.log('PASS fallback-order', cases.length, 'cases');
}

await testDataUrlBlob();
testFallbackOrder();
console.log('ALL OK');
