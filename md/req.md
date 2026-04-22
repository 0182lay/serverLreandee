# Express Request Objects

## req.params → อยู่ใน URL path

```
DELETE /users/abc-1234
                ↑
            req.params.userId
```

```typescript
// route
router.delete("/users/:userId", remove);

// controller
const userId = req.params.userId; // → "abc-1234"
```

---

## req.query → อยู่หลัง ? ใน URL

```
GET /users?role=student&is_active=true
           ↑               ↑
    req.query.role   req.query.is_active
```

```typescript
// route
router.get("/users", getUsers);

// controller
const role = req.query.role; // → "student"
const is_active = req.query.is_active; // → "true"
```

---

## req.body → อยู่ใน body ที่ส่งมา (JSON)

```
POST /register
Body: { "email": "test@example.com", "password": "1234" }
          ↑                               ↑
   req.body.email                  req.body.password
```

```typescript
// route
router.post("/register", register);

// controller
const { email, password } = req.body;
// email    → "test@example.com"
// password → "1234"
```

---

## สรุปเปรียบเทียบ

|              | อยู่ที่ไหน      | ใช้กับ method    | ตัวอย่าง              |
| ------------ | --------------- | ---------------- | --------------------- |
| `req.params` | URL path        | DELETE, GET, PUT | `/users/:userId`      |
| `req.query`  | หลัง `?` ใน URL | GET              | `/users?role=student` |
| `req.body`   | JSON body       | POST, PUT, PATCH | `{ "email": "..." }`  |
