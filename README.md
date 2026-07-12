# Gym Tracker

Završni rad — aplikacija za praćenje treninga. Korisnik može voditi evidenciju vježbi, sastavljati vlastite planove treninga i pratiti napredak (kilaža, volumen, tjelesna težina) kroz vrijeme.

Radimo na Quasaru (Vue 3) za frontend, koji preko Capacitora buildamo i kao Android aplikaciju. Backend je Express + Prisma na MySQL-u.

## Stack

- Quasar / Vue 3, Capacitor za Android build
- Node.js / Express API
- Prisma ORM, MySQL
- Chart.js za grafove napretka

## Struktura

- `backend/` — API server i Prisma shema
- `frontend/` — Quasar app, i web i android (`frontend/src-capacitor/android`)

## Kako pokrenuti lokalno

Treba ti Node 22+, i MySQL server negdje (lokalno preko XAMPP-a/HeidiSQL-a ili slično). Za Android build treba i Android Studio.

Backend:

```bash
cd backend
npm install
copy .env.example .env      # upiši svoje podatke za spajanje na bazu
npx prisma migrate dev
npm run prisma:seed         # ubaci početni katalog vježbi
npm run dev                 # http://localhost:3000
```

Frontend:

```bash
cd frontend
npm install
npm run dev                 # http://localhost:9000
```

Frontend u dev modu gađa `http://localhost:3000` za API pozive, pa backend mora biti upaljen prije.

Android build ide preko `npx quasar build -m capacitor -T android` iz `frontend` foldera, ili jednostavnije `npx cap open android` pa run iz Android Studija. Prvi put treba proći kroz SDK setup wizard.

## Baza

Shema je u `backend/prisma/schema.prisma` (User, Exercise, WorkoutPlan, WorkoutSession, SetLog, Goal, BodyMeasurement...). Za pregled podataka koristimo HeidiSQL, ali radi svaki MySQL klijent.

## Što app radi

- Login/registracija (JWT)
- Katalog vježbi po mišićnim skupinama, plus mogućnost dodavanja vlastitih
- Planovi treninga (serije/ponavljanja/kilaža po vježbi)
- Raspored treninga unaprijed
- Unos odrađenih treninga i praćenje napretka kroz grafove
- Ciljevi (postavljanje i praćenje)

## TODO

- [ ] finalizirati dizajn statistike/grafova
- [ ] error handling na frontendu (trenutno dosta generičnih poruka)
- [ ] deploy negdje van localhosta za demo
