import crypto from "crypto"

const secretKey:string = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY!;
var key = Buffer.from(secretKey, 'base64');

const encryptData = (plainText:string) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      key,
      iv
    );
    let encrypted = Buffer.concat([iv, cipher.update(plainText.toString(), 'utf8'), cipher.final()]);
    return encodeURIComponent(encrypted.toString('base64'));
}

const decryptData = (decryptedText:string) => {
    const ivCiphertext = Buffer.from(decodeURIComponent(decryptedText), 'base64');
    const iv = ivCiphertext.subarray(0, 16);
    const ciphertext = ivCiphertext.subarray(16);
    const cipher = crypto.createDecipheriv(
      'aes-256-cbc',
      key,
      iv
    );
    let decrypted = Buffer.concat([cipher.update(ciphertext), cipher.final()]);
    return decrypted.toString('utf-8');
}

export {
    encryptData,
    decryptData
}