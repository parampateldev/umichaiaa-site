// Creates an admin login for /admin and emails a verification link.
// Run:  node scripts/create-admin.js you@example.com
// The email must also be listed in firestore.rules (isAdmin) to see the stats.
const readline = require("readline");
const KEY = "AIzaSyCIYSw-jdZAlp0WSoHeGTnAipcsgTI1dLI";
const email = process.argv[2];
if (!email) { console.error("Usage: node scripts/create-admin.js <email>"); process.exit(1); }
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl._writeToOutput = (s) => { if (!rl._muted) process.stdout.write(s); else if (s.includes("\n")) process.stdout.write("\n"); };
rl._muted = false;
rl.question("Choose a password (12+ characters, typing is hidden): ", async (pw) => {
  rl.close();
  if (pw.length < 12) { console.error("Password must be at least 12 characters."); process.exit(1); }
  const call = async (path, body) => {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${path}?key=${KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json(); if (!r.ok) throw new Error(j.error?.message || "failed"); return j;
  };
  try {
    const u = await call("signUp", { email, password: pw, returnSecureToken: true });
    await call("sendOobCode", { requestType: "VERIFY_EMAIL", idToken: u.idToken });
    console.log(`Created ${email}. A verification email was sent: open it and click the link, then sign in at /admin.`);
  } catch (e) {
    console.error(e.message === "EMAIL_EXISTS" ? `${email} already has an account (sign in at /admin, or use "Forgot password").` : "Could not create the account: " + e.message);
    process.exit(1);
  }
});
