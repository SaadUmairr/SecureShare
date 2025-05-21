# SecureShare 🛡️

A Zero-Knowledge File Sharing Platform

---

## 📚 Table of Contents

- [1. Introduction](#1-introduction)
- [2. Features](#2-features)
- [3. Tech Stack](#3-tech-stack)
- [4. Demo & Screenshots](#4-demo--screenshots)
- [5. License](#5-license)
- [6. Author](#6-author)

---

## 1. Introduction 👋

**SecureShare** is a secure, privacy-first file sharing platform designed with **zero-knowledge encryption** at its core. Your files are encrypted **locally on your device** before they ever reach our servers. This means we can't see or access your data—**only you and your recipient can decrypt it** using a secure passphrase.

Think of it as sending a sealed, unbreakable box. Even though we help deliver it, **we don’t have the key**, and we never will.

---

## 2. Features ✨

- 🔐 **Client-Side Encryption:** Files are encrypted in your browser before upload—nothing leaves your device unprotected.
- 🔑 **Passphrase-Protected Keys:** Encryption keys are locked with a passphrase that only you and your recipient know.
- ⏳ **Auto-Expiry:** Files self-destruct after a set duration—no manual cleanup needed.
- 📉 **Download Limits:** Limit how many times a file can be accessed.
- 🚫 **No Ads. No Tracking:** We don’t track you, and we never will.
- 🧘 **Minimal Data Collection:** Only your IP is temporarily stored for abuse prevention only when using the trial. Otherwise, **we collect nothing**.

---

## 3. Tech Stack 🛠️

**Frontend:**

- [Next.js](https://nextjs.org/) with TypeScript
- [Shadcn UI](https://ui.shadcn.com/) for modern, accessible components
- [Framer Motion](https://motion.dev/) for smooth animations

**Backend:**

- [Neon Postgres](https://www.postgresql.org/) database
- [Prisma](https://www.prisma.io/) ORM
- [Auth.js](https://authjs.dev/) for authentication (via Google OAuth)

---

## 4. Demo & Screenshots 📽️

### 🎥 [Watch the Demo Video](https://youtu.be/Qf1SPPuSlAM)

_(Click thumbnail to play)_  
[![Watch the video](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/thumbnail.png)](https://youtu.be/Qf1SPPuSlAM)

### 🖼️ Screenshots

#### Homepage

![Homepage](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/upload.png)

#### Passphrase Setup

![Passphrase Setup](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/passphrase.png)

#### Profile Page

![Profile](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/profile.png)

#### File Selection

![Files Selected](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/files.png)

#### Uploaded Files Overview

![All Uploaded Files](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/uploaded.png)

#### Enter Share Passphrase

![Share Passphrase Input](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/share.png)

#### Share Link

![Share URL](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/share_link.png)

#### Access Shared File

![Share File Access](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/share_page.png)

#### Incorrect Passphrase

![Incorrect Input](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/share_incorrect.png)

#### File Download Available

![Download Ready](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/share_dl.png)

#### Download Limit Reached

![Limit Reached](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/share_dl_limit.png)

#### File Expired

![File Expired](https://dxrzx5m4k5m8.cloudfront.net/assets/projects/secureshare/share_expired.png)

---

## 5. License 📄

This project is licensed under the **[GNU GPL v3 License](LICENSE)**. See the `LICENSE` file for more details.

---

## 6. Author ✍️

- **Saad Umair** — [@SaadUmairr](https://github.com/SaadUmairr)

---
