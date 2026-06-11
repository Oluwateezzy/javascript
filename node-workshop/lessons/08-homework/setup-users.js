// setup-users.js - Run automatically before homework script to create mock user directory
const fs = require('fs');
const path = require('path');

const usersDir = path.join(__dirname, 'users');

if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

console.log("Generating 50 mock user profile JSON files inside lessons/08-homework/users/...");

for (let i = 1; i <= 50; i++) {
  const user = {
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    role: i % 5 === 0 ? 'admin' : 'member',
    profile: {
      bio: `This is the user profile bio for User number ${i}.`,
      signUpDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
    }
  };
  
  fs.writeFileSync(path.join(usersDir, `${i}.json`), JSON.stringify(user, null, 2));
}

console.log("✅ Mock database generation complete!");
