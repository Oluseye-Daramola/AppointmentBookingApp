# Appointment Booking API

A production-shaped backend for an appointment booking platform, built with **Node.js**,
**Express**, and **MongoDB (Mongoose)**. Providers publish their services and weekly
availability; customers book conflict-free appointments.

## Tech stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Runtime    | Node.js 18+                                                   |
| Framework  | Express 4                                                     |
| Database   | MongoDB via Mongoose                                          |
| Auth       | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`                  |
| Validation | Joi                                                           |
| Security   | Helmet, express-rate-limit, express-mongo-sanitize, hpp, CORS |
| Logging    | Winston + Morgan                                              |
| Testing    | Jest, Supertest                                               |
