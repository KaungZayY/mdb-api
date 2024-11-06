# Movie Database API

**Base URL:** `https://mdb-api.vercel.app/`

## Overview

This Movie Database API provides endpoints to manage movies, reviews, and user profiles. It supports functionalities like uploading images, creating and retrieving movie details, posting and updating reviews, and user authentication with login, refresh, and logout options.

### Table of Contents

- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Endpoints](#endpoints)
  - [Movies](#movies)
  - [Reviews](#reviews)
  - [Users](#users)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Test Locally](#test-locally)
- [Conclusion](#conclusion)


## Getting Started

To use this API, make requests to the base URL followed by the endpoint paths described below. For certain endpoints, authentication is required via token-based authentication.


##  Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **NPM Packages**: mongoose, bcrypt, jwt
- **Unit Test**: jest

---

## Endpoints

### Movies

#### 1. Upload Movie Image
- **Endpoint:** `/api/v1/movies/upload-image`
- **Method:** POST
- **Params:** Form-data with key `image`
- **Returns:** File path of the uploaded image.

#### 2. Create a New Movie
- **Endpoint:** `/api/v1/movies`
- **Method:** POST
- **Body Parameters:**
  - `title` (string) - Movie title
  - `imageUrl` (string) - URL of the movie image
  - `studio` (string) - Movie studio name
  - `runningtime` (number) - Running time in minutes
  - `genre` (string, optional) - Movie genre
  - `director` (string) - Director's name
  - `year` (number) - Release year

#### 3. Get All Movies
- **Endpoint:** `/api/v1/movies`
- **Method:** GET
- **Query Parameters:** 
  - `page` (number, optional) - Page number for pagination
  - `limit` (number, optional) - Number of results per page

#### 4. Get Movie by ID
- **Endpoint:** `/api/v1/movies/:id`
- **Method:** GET
- **URL Parameters:** `id` - Movie ID

#### 5. Get Movies by Genre
- **Endpoint:** `/api/v1/movies/genre/:genre`
- **Method:** GET
- **URL Parameters:** `genre` - Movie genre to filter by

#### 6. Update Movie by ID
- **Endpoint:** `/api/v1/movies/:id`
- **Method:** PUT
- **URL Parameters:** `id` - Movie ID
- **Body Parameters:** 
  - Similar to the "Create a New Movie" endpoint.

#### 7. Delete Movie by ID
- **Endpoint:** `/api/v1/movies/:id`
- **Method:** DELETE
- **URL Parameters:** `id` - Movie ID

---

### Reviews

#### 1. Get All Reviews for a Movie
- **Endpoint:** `/api/v1/movies/:id/reviews`
- **Method:** GET
- **URL Parameters:** `id` - Movie ID

#### 2. Create a Review for a Movie
- **Endpoint:** `/api/v1/movies/:id/reviews`
- **Method:** POST
- **URL Parameters:** `id` - Movie ID
- **Body Parameters:**
  - `rating` (number) - Review rating
  - `review` (string) - Review text

#### 3. Update a Review by ID
- **Endpoint:** `/api/v1/movies/reviews/:id`
- **Method:** PUT
- **URL Parameters:** `id` - Review ID
- **Body Parameters:** 
  - Similar to "Create a Review for a Movie".

#### 4. Delete a Review by ID
- **Endpoint:** `/api/v1/movies/reviews/:id`
- **Method:** DELETE
- **URL Parameters:** `id` - Review ID

---

### Users

#### 1. Upload Profile Image
- **Endpoint:** `/api/v1/users/upload-profile`
- **Method:** POST
- **Params:** Form-data with key `image`
- **Returns:** File path of the uploaded image.

#### 2. Create New User
- **Endpoint:** `/api/v1/users`
- **Method:** POST
- **Body Parameters:**
  - `name` (string) - User's name
  - `profileImageUrl` (string) - Profile image URL
  - `email` (string) - Email address
  - `password` (string) - Password
  - `phonenumber` (string, optional) - Phone number

#### 3. User Login
- **Endpoint:** `/api/v1/users/login`
- **Method:** POST
- **Body Parameters:**
  - `email` (string) - Email address
  - `password` (string) - Password

#### 4. Refresh Token
- **Endpoint:** `/api/v1/users/refresh`
- **Method:** POST
- **Body Parameters:**
  - `token` (string) - Refresh token

#### 5. User Logout
- **Endpoint:** `/api/v1/users/logout`
- **Method:** DELETE
- **Body Parameters:**
  - `token` (string) - Token to invalidate

---

## Authentication

Most of the user-related and review-related endpoints require authentication. The token is provided upon login and should be included in the request header as follows:

```http
Authorization: Bearer <token>
```

## Error Handling
The API returns standardized error messages with relevant HTTP status codes for easy debugging. Some of the standard responses include:
- **400 Bad Request:** Validation errors or missing required fields
- **401 Unauthorized:** Missing or invalid authentication token
- **404 Not Found:** Requested resource not found (e.g., invalid movie or review ID)
- **500 Internal Server Error:** Server-side issues

---

## Test Locally

### Prerequisites
Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version v20.18.0 or higher)
- **npm**
- **MongoDB**
- **Docker Compose:** installed on your system

### Step 1: Clone the Repository

Clone the repository on your local machine.
```bash
git clone git@github.com:KaungZayY/mdb-api.git
```
`cd` into cloned repository.
```bash
cd mdb-api
```

### Step 2: Environmental Variable Setup
Copy the `.env.example` file as `.env`
```bash
cp .env.example .env
```
Setup the env variables in `.env`.

### Step 3: NPM install
```bash
npm install
```
### Step 4: Test Locally
Run the Node server
```bash
npm run dev
```

---

## Conclusion

The Movie Database API is a robust platform for managing movie information, user-generated reviews, and user accounts. Designed with flexibility and scalability in mind, it provides a full suite of endpoints for interacting with movie data, including functionalities for image uploads, detailed movie metadata, and secure authentication mechanisms. 

---