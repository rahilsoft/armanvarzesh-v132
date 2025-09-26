
# Nutrition API Documentation

## Get Nutrition Plans

- **Endpoint:** /nutrition/plans
- **Method:** GET
- **Response:**
  - plans: array of nutrition plan objects

## Add Nutrition Plan

- **Endpoint:** /nutrition/add
- **Method:** POST
- **Request Body:**
  - title: string
  - calories: number
- **Response:**
  - planId: string
