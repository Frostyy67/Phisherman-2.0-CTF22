# Phisherman 2.0 CTF - Challenge Guide

## 🎯 For CTF Organizers

This document contains all challenges, solutions, and how to modify them.

---

## Challenge 1: The Hidden Message
**Category:** Cryptography  
**Difficulty:** Easy  
**Points:** 100

### Description
A classified document containing a Base64 encoded message.

### Challenge File
`/public/challenges/challenge1_secret.txt`

### Encoded Data
```
SGVsbG9fQ1RGX1BsYXllcnsxbV9hX2JBczY0X2V4cDNydH0=
```

### Solution
Decode Base64:
```bash
echo "SGVsbG9fQ1RGX1BsYXllcnsxbV9hX2JBczY0X2V4cDNydH0=" | base64 -d
```
Or use: https://www.base64decode.org/

### 🚩 FLAG
```
Hello_CTF_Player{1m_a_bAs64_exp3rt}
```

### How to Change Flag
1. Create your new flag
2. Encode it: `echo -n "YOUR_NEW_FLAG" | base64`
3. Update `/public/challenges/challenge1_secret.txt`
4. Update `/backend/server.js` CHALLENGES array (id: 0)

---

## Challenge 2: SQL Injection Master
**Category:** Web Security  
**Difficulty:** Medium  
**Points:** 500

### Description
A vulnerable bank login portal that can be bypassed using SQL injection.

### Challenge File
`/public/challenges/challenge2_login.html`

### Vulnerability
The login form is vulnerable to SQL injection in the username field.

### Solution
Enter one of these in the username field:
- `' OR '1'='1' --`
- `admin' OR '1'='1' --`
- `' OR 1=1--`

### 🚩 FLAG
```
CTF{sql_1nj3ct10n_m4st3r_2024}
```

### How to Change Flag
1. Edit `/public/challenges/challenge2_login.html`
2. Find the line with the flag in the JavaScript
3. Update `/backend/server.js` CHALLENGES array (id: 1)

---

## Challenge 3: Reverse Engineering
**Category:** Binary/Reversing  
**Difficulty:** Hard  
**Points:** 300

### Description
A Python "crackme" program with a hidden license key encoded in hex.

### Challenge File
`/public/challenges/challenge3_crackme.py`

### Hex Data
```python
LICENSE_DATA = [
    0x43, 0x54, 0x46, 0x7B,  # C T F {
    0x72, 0x33, 0x76, 0x33,  # r 3 v 3
    0x72, 0x73, 0x33, 0x5F,  # r s 3 _
    0x6D, 0x61, 0x73, 0x74,  # m a s t
    0x33, 0x72, 0x7D         # 3 r }
]
```

### Solution
Convert hex to ASCII:
```python
flag = ''.join([chr(x) for x in [0x43, 0x54, 0x46, 0x7B, 0x72, 0x33, 0x76, 0x33, 0x72, 0x73, 0x33, 0x5F, 0x6D, 0x61, 0x73, 0x74, 0x33, 0x72, 0x7D]])
print(flag)
```

### 🚩 FLAG
```
CTF{r3v3rs3_mast3r}
```

### How to Change Flag
1. Create your new flag
2. Convert to hex: `[hex(ord(c)) for c in "YOUR_FLAG"]`
3. Update `/public/challenges/challenge3_crackme.py`
4. Update `/backend/server.js` CHALLENGES array (id: 2)

---

## Challenge 4: Network Forensics
**Category:** Forensics  
**Difficulty:** Expert  
**Points:** 450

### Description
Intercepted communication encrypted with ROT13 cipher.

### Challenge File
`/public/challenges/challenge4_forensics.txt`

### Encrypted Flag
```
PGS{argjbex_sberfavpf_ceb}
```

### Solution
Apply ROT13 decryption:
```python
import codecs
print(codecs.decode("PGS{argjbex_sberfavpf_ceb}", 'rot_13'))
```
Or use: https://rot13.com/

### 🚩 FLAG
```
CTF{network_forensics_pro}
```

### How to Change Flag
1. Create your new flag
2. Encode with ROT13: `codecs.encode("YOUR_FLAG", 'rot_13')`
3. Update `/public/challenges/challenge4_forensics.txt`
4. Update `/backend/server.js` CHALLENGES array (id: 3)

---

## 🔧 Adding New Challenges

### Step 1: Create Challenge File
Add your challenge file to `/frontend/public/challenges/`

### Step 2: Update Backend
Edit `/backend/server.js` and add to CHALLENGES array:
```javascript
{
    id: 4,  // Next ID
    title: "Your Challenge Name",
    points: 200,
    flag: "CTF{your_flag_here}"
}
```

### Step 3: Update Frontend
Edit `/frontend/src/Components/Flag.jsx` challenges array:
```javascript
{
    id: 4,
    title: "Your Challenge Name",
    category: "Category",
    difficulty: "Easy/Medium/Hard/Expert",
    points: 200,
    icon: Code,  // Import from lucide-react
    description: "Challenge description",
    hint: "Hint for players",
    downloadFile: "/challenges/your_file.txt",
    color: "cyan-blue"  // or purple-pink, orange-red, green-emerald
}
```

### Step 4: Update Database Schema (if needed)
If adding more than 4 challenges, update `/backend/models/Solved.js`:
```javascript
flag5: String,
flag6: String,
// etc.
```

---

## 📋 Quick Reference

| Challenge | Category | Points | Flag |
|-----------|----------|--------|------|
| The Hidden Message | Crypto | 100 | `Hello_CTF_Player{1m_a_bAs64_exp3rt}` |
| SQL Injection Master | Web | 500 | `CTF{sql_1nj3ct10n_m4st3r_2024}` |
| Reverse Engineering | Binary | 300 | `CTF{r3v3rs3_mast3r}` |
| Network Forensics | Forensics | 450 | `CTF{network_forensics_pro}` |

**Total Points Available:** 1350

---

## ⚠️ Security Reminders

1. **NEVER** expose flags in frontend code
2. All flag validation happens on the server
3. Flags are stored in `/backend/server.js` only
4. Change `JWT_SECRET` in production
5. Use HTTPS in production

---

## 🚀 Running the CTF

```bash
# Start backend
cd backend
node server.js

# Start frontend (separate terminal)
cd frontend
npm run dev
```

## 👥 Registered Users

| Username | Email |
|----------|-------|
| Admin | admin@phisherman.ctf |
| a.fnan | afnanothayi232500@gmail.com |
| Crzaycat007 | kiranng@yahoo.com |
| devil_42401 | nivednarayananm2@gmail.com |
| bytetyson_71338 | bansilsaji03@gmail.com |
| n70ue | dhaneshupai7@gmail.com |

To add new users, edit and run `seed.js`.
