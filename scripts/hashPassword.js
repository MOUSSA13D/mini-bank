// Usage: node scripts/hashPassword.js <plainPassword>
const bcrypt = require('bcryptjs');

async function run() {
  const plain = process.argv[2];
  if (!plain) {
    console.error('Usage: node scripts/hashPassword.js <plainPassword>');
    process.exit(1);
  }
  const hash = await bcrypt.hash(plain, 10);
  console.log(hash);
}

run().catch(err => { console.error(err); process.exit(1); });
