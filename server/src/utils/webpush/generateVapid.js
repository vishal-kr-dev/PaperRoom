import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();
console.log(keys);

console.log(keys.publicKey.length)
