# Gym Tracker — Aplikacija za praćenje treninga i napretka

Završni rad: aplikacija koja korisnicima omogućava praćenje vlastitih treninga, planiranje vježbi i evidenciju napretka kroz vrijeme.

## Tehnologije

- **Frontend / mobilna aplikacija**: [Quasar Framework](https://quasar.dev) (Vue 3) + Capacitor (Android)
- **Backend**: Node.js + Express (REST API)
- **ORM**: Prisma
- **Baza podataka**: MySQL
- **Grafovi napretka**: Chart.js

## Struktura repozitorija

```
backend/          Express API server + Prisma shema
frontend/         Quasar aplikacija (web + Android putem Capacitora)
```

## Preduvjeti

- Node.js 22+ i npm
- MySQL server (lokalno ili putem npr. XAMPP-a)
- Za Android build: Android Studio (SDK, JDK)

## Pokretanje backend servera

```bash
cd backend
npm install
copy .env.example .env      # i upiši stvarne podatke za spajanje na bazu
npx prisma migrate dev      # kreira tablice u bazi
npm run prisma:seed         # puni katalog vježbi početnim podacima
npm run dev                 # pokreće server na http://localhost:3000
```

## Pokretanje frontend aplikacije (web)

```bash
cd frontend
npm install
npm run dev                 # pokreće dev server na http://localhost:9000
```

Aplikacija u dev modu očekuje da backend radi na `http://localhost:3000`.

## Android build (Capacitor)

Android platforma je već dodana u `frontend/src-capacitor/android`. Za build:

```bash
cd frontend
npx quasar build -m capacitor -T android
```

Prvi put je potrebno otvoriti projekt u Android Studiju (`npx cap open android` iz `frontend` foldera) i proći kroz jednokratni SDK setup wizard prije nego Gradle build uspije.

## Baza podataka

Baza `gym_tracker` upravlja se preko [HeidiSQL](https://www.heidisql.com/) ili bilo kojeg MySQL klijenta. Shema (tablice `User`, `Exercise`, `WorkoutPlan`, `WorkoutSession`, `SetLog`, `Goal`, `BodyMeasurement`, itd.) definirana je u `backend/prisma/schema.prisma`.

## Funkcionalnosti

- Registracija i prijava korisnika (JWT autentifikacija)
- Katalog vježbi (predefinirane + korisničke vježbe) filtriran po mišićnoj skupini
- Kreiranje predložaka treninga (planova) s ciljanim serijama/ponavljanjima/kilažom
- Planiranje treninga unaprijed (raspored)
- Evidencija odrađenih treninga — unos serija, ponavljanja i kilaže po vježbi
- Praćenje napretka kroz grafove (napredak po vježbi, volumen po mišićnoj skupini, tjelesna težina kroz vrijeme)
- Postavljanje i praćenje osobnih ciljeva
