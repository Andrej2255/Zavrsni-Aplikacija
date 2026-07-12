# Gym Tracker

Završni rad — aplikacija za praćenje treninga. Korisnik unosi treninge, sastavlja planove i prati napredak kroz vrijeme.

Frontend je Quasar/Vue, backend Node + Express + Prisma, baza MySQL. Android verzija ide preko Capacitora.

## Baza

Shema je u `backend/prisma/schema.prisma` — User, Exercise, WorkoutPlan, WorkoutSession, SetLog, Goal, BodyMeasurement.

## Funkcionalnosti

- Registracija/login
- Katalog vježbi + dodavanje vlastitih
- Planovi treninga
- Raspored treninga
- Unos odrađenih treninga
- Grafovi napretka
- Ciljevi

## Ostalo za napraviti

- Bolji error handling na frontu
- Cleartext HTTP fix je samo za dev, za produkciju treba HTTPS
- Testiranje na starijim verzijama Androida
- Deploy (za sad radi samo lokalno)
