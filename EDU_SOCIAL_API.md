# Edu Social Media API Endpoints

Base URL (local): `http://localhost:3001`

All protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 1) Dedicated Teacher/Student Auth Endpoints

### 1.1 Teacher Register
**POST** `/api/auth/teachers/register`

Request body:
```json
{
  "name": "Ayesha Rahman",
  "email": "ayesha.teacher@school.edu",
  "password": "TeacherPass@123",
  "department": "Chemistry",
  "institution": "Dhaka College"
}
```

### 1.2 Student Register
**POST** `/api/auth/students/register`

Request body:
```json
{
  "name": "Rahim Uddin",
  "email": "rahim.student@school.edu",
  "password": "StudentPass@123",
  "department": "Science",
  "institution": "Dhaka College"
}
```

### 1.3 Teacher Login
**POST** `/api/auth/teachers/login`

Request body:
```json
{
  "email": "ayesha.teacher@school.edu",
  "password": "TeacherPass@123"
}
```

### 1.4 Student Login
**POST** `/api/auth/students/login`

Request body:
```json
{
  "email": "rahim.student@school.edu",
  "password": "StudentPass@123"
}
```

### 1.5 Current Logged-in User
**GET** `/api/auth/me`

No request body.

---

## 2) Social Post Endpoints

### 2.1 Create Post
**POST** `/api/social/posts`

Request body:
```json
{
  "content": "আজকের organic chemistry class notes দিলাম।",
  "mediaUrl": "https://cdn.example.com/notes/chapter-3.pdf",
  "privacy": "public"
}
```

### 2.2 Get Feed Posts
**GET** `/api/social/posts?limit=20&offset=0`

No request body.

### 2.3 Get Single Post Details (with likes/comments)
**GET** `/api/social/posts/:postId`

No request body.

### 2.4 Update Own Post
**PATCH** `/api/social/posts/:postId`

Request body (any one or multiple fields):
```json
{
  "content": "Updated post content",
  "mediaUrl": "https://cdn.example.com/updated.pdf",
  "privacy": "friends"
}
```

### 2.5 Delete Own Post
**DELETE** `/api/social/posts/:postId`

No request body.

---

## 3) Like Endpoints

### 3.1 Like a Post
**POST** `/api/social/posts/:postId/likes`

No request body.

### 3.2 Remove Like from a Post
**DELETE** `/api/social/posts/:postId/likes`

No request body.

---

## 4) Comment Endpoints

### 4.1 Add Comment on Post
**POST** `/api/social/posts/:postId/comments`

Request body:
```json
{
  "commentText": "ধন্যবাদ স্যার, এটা খুব helpful ছিল।",
  "parentCommentId": null
}
```

For reply comment:
```json
{
  "commentText": "I agree with this point.",
  "parentCommentId": 12
}
```

### 4.2 Delete Own Comment
**DELETE** `/api/social/comments/:commentId`

No request body.

---

## 5) Share Endpoints

### 5.1 Share a Post
**POST** `/api/social/posts/:postId/shares`

Request body:
```json
{
  "caption": "সবাই দেখো, এই post টা খুব important."
}
```

### 5.2 Get All Shares
**GET** `/api/social/shares`

No request body.

---

## 6) Friend Request Endpoints

### 6.1 Send Friend Request
**POST** `/api/social/friend-requests`

Request body:
```json
{
  "receiverId": 7
}
```

### 6.2 Get Incoming/Outgoing Friend Requests
**GET** `/api/social/friend-requests`

No request body.

### 6.3 Respond to Friend Request (accept/reject)
**PATCH** `/api/social/friend-requests/:requestId/respond`

Request body:
```json
{
  "action": "accepted"
}
```

or

```json
{
  "action": "rejected"
}
```

### 6.4 Cancel Pending Friend Request
**DELETE** `/api/social/friend-requests/:requestId`

No request body.

---

## 7) Friends Endpoints

### 7.1 Get Friend List
**GET** `/api/social/friends`

No request body.

### 7.2 Unfriend / Remove Friend
**DELETE** `/api/social/friends/:friendId`

No request body.

---

## 8) Search Endpoints

### 8.1 Search Users and Posts
**GET** `/api/social/search?q=chemistry&role=teacher&limit=20`

Query params:
- `q` (required)
- `role` (optional: `teacher` or `student`)
- `limit` (optional)

No request body.

---

## Notes

- New tables are auto-created on first call through the API routes.
- Dedicated auth for teacher/student is separated via different endpoints.
- Social module supports post create/read/update/delete, likes, comments, shares, friend requests, friendships, and search.

