# 🔍 Swagger UI Access Guide

## 📍 **Where to Access Swagger UI**

Once you start your Spring Boot application, you can access Swagger UI at the following URLs:

### **Primary Swagger UI URL:**

```
http://localhost:8080/swagger-ui.html
```

### **Alternative URLs:**

```
http://localhost:8080/swagger-ui/index.html
http://localhost:8080/swagger-ui/
```

### **OpenAPI JSON Documentation:**

```
http://localhost:8080/api-docs
http://localhost:8080/v3/api-docs
```

## 🚀 **How to Start the Application**

1. **Run the Spring Boot application:**

   ```bash
   mvn spring-boot:run
   ```

2. **Or build and run:**

   ```bash
   mvn clean install
   java -jar target/access-controller-0.0.1-SNAPSHOT.jar
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:8080/swagger-ui.html
   ```

## 📋 **What You'll See in Swagger UI**

### **API Documentation Sections:**

- **Account Management**: Authentication, authorization, and CRUD operations
- **Client Management**: Client CRUD operations
- **Role Management**: Role CRUD operations
- **Resource Management**: Resource CRUD operations

### **Features Available:**

- ✅ **Interactive API Testing**: Test endpoints directly from the UI
- ✅ **Request/Response Examples**: See example payloads
- ✅ **Authentication**: JWT token support
- ✅ **Schema Documentation**: Complete model documentation
- ✅ **Try It Out**: Execute API calls with real data

## 🔧 **Swagger Configuration**

The Swagger configuration is located in:

- **Configuration Class**: `src/main/java/com/example/microtest/accesscontroller/config/OpenApiConfig.java`
- **Properties**: `src/main/resources/application.properties`

### **Customization Options:**

- API Title: "Access Controller API"
- Version: 1.0.0
- Description: Comprehensive access control system
- Contact Information: Included
- License: MIT License

## 🎯 **Testing Authentication Flow**

1. **Create a Client** (using Client Management APIs)
2. **Create a Role** (using Role Management APIs)
3. **Create a Resource** (using Resource Management APIs)
4. **Create an Account** (using Account Management APIs)
5. **Test Authentication** (using `/api/accounts/authenticate`)
6. **Test Authorization** (using `/api/accounts/check-access`)

## 📱 **Mobile-Friendly**

Swagger UI is responsive and works well on mobile devices for API testing and documentation viewing.

---

**Happy API Testing! 🎉**
