# Architecture Diagram (Mermaid)

```mermaid
flowchart LR
  subgraph Clients
    U(User PWA)
    C(Coach PWA)
    UA(User App)
    CA(Coach App)
    A(Admin Web)
  end

  subgraph Backend
    B[API Gateway / NestJS]
    N[Nutrition Module]
    No[Notifications Module]
    P[Payments Module]
  end

  subgraph Infra
    DB[(PostgreSQL)]
    R[(Redis)]
    Q1((BullMQ: notifications))
    Q2((BullMQ: billing))
  end

  U-->B
  C-->B
  UA-->B
  CA-->B
  A-->B

  B-->N
  B-->No
  B-->P

  N-- Prisma -->DB
  No-- Prisma -->DB
  P-- Prisma -->DB

  No-- jobs -->Q1
  P-- jobs -->Q2
  Q1-- uses -->R
  Q2-- uses -->R

  subgraph Providers
    VAPID[WebPush (VAPID)]
    FCM[FCM]
    APNs[APNs]
    Stripe[Stripe]
    RC[RevenueCat]
  end
  Q1-->VAPID
  Q1-->FCM
  Q1-->APNs
  Q2-->Stripe
  Q2-->RC
```
