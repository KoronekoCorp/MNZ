/**
 * 便于在浏览器环境下测试解密
 * @param {string} encrypted 
 * @param {string} key 
 * @returns 
 */

async function decrypt(encrypted, key = 'zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn') {
  try {
    const encodedKey = new TextEncoder().encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedKey);
    const aesKey = await crypto.subtle.importKey('raw', hashBuffer, { name: 'AES-CBC' }, false, ['decrypt']);

    const encryptedBuffer = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: new Uint8Array(16) }, aesKey, encryptedBuffer);
    const decrypted = new TextDecoder('UTF-8').decode(decryptedBuffer);

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return JSON.stringify({ "error": "Decryption error" });
  }
}

function decrypt(encrypted, key = 'zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn') {
  try {
    const aesKey = crypto.createHash('sha256').update(key).digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.alloc(16, 0));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'base64'), 'utf-8'),
      decipher.final(),
    ]);

    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return JSON.stringify({ "error": "Decryption error" });
  }
}