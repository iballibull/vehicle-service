# 🎯 Design & Development Rules

> **Vehicle Service Reservation API**  
> Modular Monolith Architecture with Express.js & Prisma

---

## 📐 Architecture Principles

### 1. **Modular Monolith Pattern**

```
src/modules/
├── auth/              # Authentication & authorization
├── serviceSchedule/   # Schedule management (dealer)
├── serviceBooking/    # Booking management (customer + dealer)
└── shared/            # Cross-cutting concerns
```

**Rules**:
- ✅ Each module is **self-contained** (controller → service → repository)
- ✅ Modules communicate via **service layer** (not direct repo access)
- ✅ Shared logic goes to `shared/` module
- ❌ No circular dependencies between modules
- ❌ Controllers never call repositories directly

---

### 2. **Layered Architecture**

```
Request → Controller → Service → Repository → Database
            ↓            ↓          ↓
         Validation   Business   Data Access
                       Logic
```

#### **Controller Layer** (`*.controller.js`)
- **Responsibility**: HTTP handling, request/response mapping
- **Rules**:
  - ✅ Parse request (body, params, query)
  - ✅ Call service layer
  - ✅ Return HTTP response (status code + JSON)
  - ❌ No business logic
  - ❌ No database queries
  - ❌ No validation logic (use schemas)

**Example**:
```javascript
// ✅ GOOD
export const createBooking = async (req, res) => {
  const result = await bookingService.create(req.body);
  return res.status(201).json(result);
};

// ❌ BAD - Business logic in controller
export const createBooking = async (req, res) => {
  if (new Date(req.body.serviceDate) <= new Date()) {
    return res.status(400).json({ error: "Must be H+1" });
  }
  // ...
};
```

---

#### **Service Layer** (`*.service.js`)
- **Responsibility**: Business logic, orchestration, transactions
- **Rules**:
  - ✅ Implement business rules
  - ✅ Orchestrate multiple repositories
  - ✅ Handle transactions
  - ✅ Throw domain errors
  - ❌ No HTTP concerns (status codes, headers)
  - ❌ No direct database queries (use repositories)

**Example**:
```javascript
// ✅ GOOD
export const createBooking = async (data) => {
  // Business rule: H+1 validation
  if (!isValidBookingDate(data.serviceDate)) {
    throw new BusinessError("Booking must be at least H+1");
  }

  // Transaction: decrease quota + create booking
  return await prisma.$transaction(async (tx) => {
    const schedule = await scheduleRepo.findById(data.scheduleId, tx);
    if (schedule.remainingQuota < 1) {
      throw new BusinessError("No quota available");
    }
    
    await scheduleRepo.decreaseQuota(data.scheduleId, tx);
    return await bookingRepo.create(data, tx);
  });
};
```

---

#### **Repository Layer** (`*.repo.js`)
- **Responsibility**: Data access, Prisma queries
- **Rules**:
  - ✅ Pure data operations (CRUD)
  - ✅ Accept transaction context (`tx`)
  - ✅ Return domain objects
  - ❌ No business logic
  - ❌ No validation

**Example**:
```javascript
// ✅ GOOD
export const decreaseQuota = async (scheduleId, tx = prisma) => {
  return await tx.serviceSchedule.update({
    where: { id: scheduleId },
    data: { remainingQuota: { decrement: 1 } },
  });
};
```

---

## 🔐 Security Rules

### 1. **Authentication**
- ✅ Use **JWT** for dealer authentication
- ✅ Store hashed passwords with **bcrypt** (salt rounds: 10)
- ✅ Token expiry: **24 hours**
- ❌ Never store plain-text passwords
- ❌ Never expose password in API responses

### 2. **Authorization**
- ✅ Dealer-only endpoints: `/dealer/*`
- ✅ Public endpoints: `/bookings`, `/schedules/available`
- ✅ Use middleware: `authMiddleware` → `roleMiddleware`

**Example**:
```javascript
// Protected route
router.post('/dealer/schedules', authMiddleware, dealerOnly, scheduleController.create);

// Public route
router.post('/bookings', bookingController.create);
```

### 3. **Input Validation**
- ✅ Validate **all** user inputs using schemas (`*.schema.js`)
- ✅ Use **Zod** or **Joi** for validation
- ✅ Sanitize inputs (trim, escape)
- ❌ Never trust client data

---

## 🗄️ Database Rules

### 1. **Prisma Best Practices**
- ✅ Use **UUIDs** for primary keys
- ✅ Use **snake_case** for database columns (`@map`)
- ✅ Use **camelCase** in Prisma models
- ✅ Always use **transactions** for multi-step operations
- ✅ Use **indexes** for foreign keys and frequently queried fields

### 2. **Transaction Guidelines**
**When to use transactions**:
- ✅ Booking creation (decrease quota + insert booking)
- ✅ Booking cancellation (increase quota + update status)
- ✅ Any operation modifying multiple tables

**Example**:
```javascript
await prisma.$transaction(async (tx) => {
  await scheduleRepo.decreaseQuota(scheduleId, tx);
  await bookingRepo.create(data, tx);
});
```

### 3. **Concurrency Control**
- ✅ Use **SELECT FOR UPDATE** for quota checks
- ✅ Handle race conditions with **optimistic locking**
- ✅ Set transaction isolation level: `READ COMMITTED`

**Example**:
```javascript
const schedule = await tx.serviceSchedule.findUnique({
  where: { id: scheduleId },
  // Pessimistic locking
});
```

---

## 📝 Naming Conventions

### 1. **Files**
```
✅ auth.controller.js
✅ auth.service.js
✅ auth.repo.js
✅ auth.schema.js
❌ authController.js
❌ Auth.controller.js
```

### 2. **Variables & Functions**
```javascript
✅ camelCase for variables/functions
✅ PascalCase for classes/constructors
✅ UPPER_SNAKE_CASE for constants

// Examples
const bookingService = new BookingService();
const MAX_QUOTA = 10;
```

### 3. **Database**
```javascript
// Prisma model (camelCase)
model ServiceSchedule {
  serviceDate DateTime @map("service_date")
}

// Database column (snake_case)
service_date
```

---

## 🚨 Error Handling

### 1. **Error Types**
```javascript
// Business errors (4xx)
class BusinessError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// System errors (5xx)
class SystemError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
```

### 2. **Error Response Format**
```json
{
  "success": false,
  "error": {
    "message": "No quota available for selected schedule",
    "code": "QUOTA_UNAVAILABLE",
    "timestamp": "2026-01-21T14:25:39+07:00"
  }
}
```

### 3. **Global Error Handler**
```javascript
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    },
  });
});
```

---

## 📊 API Response Format

### 1. **Success Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerName": "John Doe",
    "status": "menunggu_konfirmasi"
  },
  "meta": {
    "timestamp": "2026-01-21T14:25:39+07:00"
  }
}
```

### 2. **List Response**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "timestamp": "2026-01-21T14:25:39+07:00"
  }
}
```

---

## 🧪 Testing Rules

### 1. **Test Structure**
```
tests/
├── unit/              # Service layer tests
├── integration/       # API endpoint tests
└── fixtures/          # Test data
```

### 2. **Test Coverage**
- ✅ **Service layer**: 80%+ coverage
- ✅ **Critical paths**: Booking creation, quota management
- ✅ **Edge cases**: Race conditions, validation errors

### 3. **Test Naming**
```javascript
describe('BookingService', () => {
  describe('createBooking', () => {
    it('should decrease quota when booking is created', async () => {
      // ...
    });
    
    it('should throw error when quota is 0', async () => {
      // ...
    });
    
    it('should throw error when date is not H+1', async () => {
      // ...
    });
  });
});
```

---

## 🔄 Git Workflow

### 1. **Branch Naming**
```
feature/booking-creation
fix/quota-race-condition
refactor/auth-middleware
```

### 2. **Commit Messages**
```
feat: add booking creation endpoint
fix: resolve quota race condition
refactor: extract date validation to shared utils
docs: update API documentation
```

### 3. **Pull Request Rules**
- ✅ One feature per PR
- ✅ Include tests
- ✅ Update documentation
- ✅ No merge conflicts

---

## 📦 Code Quality

### 1. **ESLint Rules**
```javascript
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### 2. **Code Review Checklist**
- [ ] Business logic in service layer
- [ ] Validation schemas used
- [ ] Transactions for multi-step operations
- [ ] Error handling implemented
- [ ] No sensitive data in logs
- [ ] Tests added/updated

---

## 🚀 Performance Guidelines

### 1. **Database Optimization**
- ✅ Use indexes for foreign keys
- ✅ Limit query results (pagination)
- ✅ Use `select` to fetch only needed fields
- ❌ Avoid N+1 queries (use `include`)

### 2. **API Optimization**
- ✅ Use compression middleware
- ✅ Implement rate limiting
- ✅ Cache static data (schedules)

---

## 📚 Documentation Requirements

### 1. **Code Documentation**
```javascript
/**
 * Create a new service booking
 * @param {Object} data - Booking data
 * @param {string} data.customerName - Customer name
 * @param {string} data.serviceDate - Service date (must be H+1)
 * @returns {Promise<Object>} Created booking
 * @throws {BusinessError} If quota unavailable or date invalid
 */
export const createBooking = async (data) => {
  // ...
};
```

### 2. **API Documentation**
- ✅ OpenAPI/Swagger specification
- ✅ Example requests/responses
- ✅ Error codes documented

---

## ⚠️ Common Pitfalls to Avoid

1. ❌ **No validation**: Always validate inputs
2. ❌ **No transactions**: Use transactions for quota management
3. ❌ **Race conditions**: Use locking for concurrent bookings
4. ❌ **Hardcoded values**: Use environment variables
5. ❌ **Exposing errors**: Never expose stack traces to clients
6. ❌ **No logging**: Log critical operations
7. ❌ **Ignoring timezones**: Use UTC, convert on client

---

## 🎓 Learning Resources

- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [REST API Design](https://restfulapi.net/)
- [Transaction Isolation Levels](https://www.postgresql.org/docs/current/transaction-iso.html)

---

**Last Updated**: 2026-01-21  
**Version**: 1.0.0
