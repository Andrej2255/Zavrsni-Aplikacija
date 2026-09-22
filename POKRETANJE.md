# Pokretanje aplikacije Gym Tracker

Upute za pokretanje na **svom računalu** i na **tuđem računalu** (npr. za obranu).

Stack: frontend Vue 3 + Vite (`http://localhost:9000`), backend Node + Express + obični SQL upiti preko mysql2 (`http://localhost:3000`), baza MySQL/MariaDB.

---

## NAJLAKŠE — baza na fakultetskom serveru (ucka.veleri.hr)

Aplikacija je namještena da koristi bazu `asmiljanic` na `ucka.veleri.hr`. Server je javno dostupan, pa radi s bilo kojeg računala s internetom — **bez lokalnog MySQL-a, bez HeidiSQL-a, bez uvoza.**

Na bilo kojem računalu (uklj. profesorovo) — `backend\.env` **već dolazi s repozitorijem**, nema dodatnih koraka nakon `npm install`:

```powershell
git clone https://github.com/Andrej2255/Zavrsni-Aplikacija.git
cd Zavrsni-Aplikacija

cd backend
npm install
npm run dev

# novi terminal:
cd ..\frontend
npm install
npm run dev
```

Otvori `http://localhost:9000`, prijava `demo1788128039@gym.hr` / `demo1234`.

Preduvjeti: instaliran **Node.js** i **internet** (server `ucka.veleri.hr` je javno dostupan).

> Ako je baza `asmiljanic` prazna: u HeidiSQL (sesija za `ucka`) → Query tab → zalijepi sadržaj `backend\gym_tracker_ucka_data.sql` → F9.

Sve ispod je alternativa s **lokalnim** MySQL-om (ako fakultetski server nije dostupan).

---

## A) Brzo pokretanje (računalo na kojem je već sve namješteno)

1. Pokreni MySQL (ako nije servis):
   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.4\my.ini" --console
   ```
2. Backend (novi terminal):
   ```powershell
   cd backend
   npm run dev
   ```
3. Frontend (novi terminal):
   ```powershell
   cd frontend
   npm run dev
   ```
4. Otvori `http://localhost:9000`

Redoslijed je uvijek **MySQL → backend → frontend**.

### Da MySQL više nikad ne moraš ručno paliti (napravi jednom, PowerShell kao administrator)

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld" --install MySQL84 --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.4\my.ini"
Set-Service MySQL84 -StartupType Automatic
Start-Service MySQL84
```

Provjera: `Get-Service MySQL84` → mora pisati `Running`.

---

## B) Postavljanje na tuđem računalu (od nule)

### 0. Preduvjeti

U PowerShellu:

```powershell
node -v         # treba v20 ili noviji. Ako "nije prepoznato" -> instaliraj Node LTS s https://nodejs.org (ponesi installer na USB-u)
git --version   # ako nema -> preuzmi ZIP s GitHuba umjesto "git clone" (korak 1)
```

MySQL mora biti instaliran i pokrenut. Trebaš **root lozinku**.

```powershell
Get-Service *mysql*    # status mora biti Running; ako je Stopped -> Start-Service <ime_servisa>
```

### 1. Dohvati kod

```powershell
cd C:\Users\Public
git clone https://github.com/Andrej2255/Zavrsni-Aplikacija.git
cd Zavrsni-Aplikacija
```

Bez gita: GitHub -> zeleni gumb **Code** -> **Download ZIP** -> raspakiraj -> uđi u mapu.

### 2. Instaliraj pakete

```powershell
cd backend
npm install
cd ..\frontend
npm install
cd ..
```

### 3. Uvezi bazu

Datoteka `backend\gym_tracker_dump.sql` došla je s kodom (sadrži sve tablice + demo podatke).

**Komandnom linijom** (prilagodi putanju/verziju MySQL-a):

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql" -u root -p < backend\gym_tracker_dump.sql
```

Upiši root lozinku kad pita. Datoteka sama kreira bazu `gym_tracker`.

**Ili u HeidiSQL:** spoji se na `localhost` (root + lozinka) -> izbornik `File` -> `Run SQL file...` -> odaberi `backend\gym_tracker_dump.sql`.

### 4. Konfiguriraj backend

```powershell
copy backend\.env.example backend\.env
notepad backend\.env
```

U `.env` upiši (lozinka je profesorova root lozinka):

```
DATABASE_URL="mysql://root:PROFESOROVA_LOZINKA@localhost:3306/gym_tracker"
JWT_SECRET="nekitajnikljuc123"
PORT=3000
```

Spremi i zatvori.

### 5. Pokreni (dva terminala)

**Terminal 1 — backend:**

```powershell
cd C:\Users\Public\Zavrsni-Aplikacija\backend
npm run dev
```

Čekaj poruku: `Backend running on http://localhost:3000`

**Terminal 2 — frontend:**

```powershell
cd C:\Users\Public\Zavrsni-Aplikacija\frontend
npm run dev
```

Automatski se otvara `http://localhost:9000`.

### 6. Prijava

```
email:    demo1788128039@gym.hr
lozinka:  demo1234
```

Ima gotove planove, odrađene treninge, ciljeve i grafove napretka. Ili klikni **Registracija** za novi račun.

---

## C) Ako nešto ne radi

| Problem | Uzrok / rješenje |
|---|---|
| „0 vježbi", gumb „Spremi" ništa ne radi | MySQL nije pokrenut ili je kriva lozinka u `backend\.env`. Pokreni MySQL, provjeri `DATABASE_URL`. |
| `Can't reach database server at localhost:3306` | MySQL servis je stopiran -> `Start-Service <ime>` |
| `Access denied for user 'root'@'localhost'` | Kriva root lozinka u `.env`. |
| Greška o `utf8mb4_0900_ai_ci` pri uvozu baze | Računalo ima stari MySQL 5.7. U datoteci `backend\gym_tracker_dump.sql` zamijeni sve `utf8mb4_0900_ai_ci` u `utf8mb4_general_ci` i ponovi uvoz. |
| Port 3000 ili 9000 zauzet | Zatvori druge Node procese: `Get-Process node \| Stop-Process -Force` |
| Frontend se digne na portu 9001 umjesto 9000 | Port 9000 je zauzet starim procesom; nije problem, samo otvori adresu koju ispiše. |

---

## D) Alternativa: baza koja putuje s projektom

Ako ne želiš svaki put uvoziti bazu, aplikacija se može prebaciti na **SQLite** (baza postane obična datoteka u projektu i radi na svakom računalu samo s Node-om, bez MySQL-a). Napomena: u pisanom radu je baza dokumentirana kao MySQL, pa bi tada trebalo uskladiti i tekst rada.
