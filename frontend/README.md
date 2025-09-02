# 🔐 Access Controller Admin Panel

A comprehensive React-based admin panel for managing the Access Controller API.

## 🚀 Features

### **Entity Management**

- ✅ **Accounts**: Full CRUD operations with dropdown relationships
- ✅ **Clients**: Complete client management
- ✅ **Roles**: Role creation and management
- ✅ **Resources**: Resource administration

### **Authentication & Authorization**

- ✅ **Login Testing**: Test authentication endpoints
- ✅ **Access Control**: Test authorization with tokens
- ✅ **JWT Token Display**: View generated tokens
- ✅ **Resource Access**: Check user permissions

### **User Experience**

- ✅ **Responsive Design**: Works on all devices
- ✅ **Form Validation**: Client-side validation with react-hook-form
- ✅ **Toast Notifications**: Success/error feedback
- ✅ **Loading States**: Visual feedback during operations
- ✅ **Dropdown Relationships**: Easy selection of related entities

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Running Access Controller backend on `http://localhost:8080`

## 🛠️ Installation

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navigation.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── AccountList.js
│   │   ├── AccountCreate.js
│   │   ├── AccountUpdate.js
│   │   ├── ClientList.js
│   │   ├── ClientCreate.js
│   │   ├── ClientUpdate.js
│   │   ├── RoleList.js
│   │   ├── RoleCreate.js
│   │   ├── RoleUpdate.js
│   │   ├── ResourceList.js
│   │   ├── ResourceCreate.js
│   │   ├── ResourceUpdate.js
│   │   ├── Authentication.js
│   │   └── Authorization.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎯 Usage Guide

### **Dashboard**

- View statistics for all entities
- Quick access to common actions
- Navigation to all sections

### **Entity Management**

#### **Accounts**

1. **List View**: See all accounts with their relationships
2. **Create**: Add new accounts with dropdown selection for Client and Role
3. **Update**: Modify existing accounts
4. **Delete**: Remove accounts with confirmation

#### **Clients**

1. **List View**: View all clients
2. **Create**: Add new clients
3. **Update**: Modify client details
4. **Delete**: Remove clients

#### **Roles**

1. **List View**: See all roles
2. **Create**: Add new roles
3. **Update**: Modify role details
4. **Delete**: Remove roles

#### **Resources**

1. **List View**: View all resources
2. **Create**: Add new resources with client selection
3. **Update**: Modify resource details
4. **Delete**: Remove resources

### **Authentication Testing**

#### **Login Test**

1. Enter client secret, username, and password
2. Submit to test authentication
3. View JWT tokens and available resources

#### **Authorization Test**

1. Enter client secret, access token, username, and resource name
2. Submit to test access control
3. View authorization results and new tokens

## 🔧 Configuration

### **API Configuration**

The app is configured to connect to the backend at `http://localhost:8080`. To change this:

1. **Development**: Update the `proxy` field in `package.json`
2. **Production**: Update `API_BASE_URL` in `src/services/api.js`

### **Environment Variables**

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8080
```

## 🎨 Styling

- **Bootstrap 5**: Modern, responsive UI components
- **Custom CSS**: Additional styling in `src/index.css`
- **Icons**: Emoji icons for visual appeal
- **Color Coding**: Different colors for different entity types

## 📱 Responsive Design

The admin panel is fully responsive and works on:

- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All modern browsers

## 🔒 Security Features

- **Form Validation**: Client-side validation prevents invalid data
- **Secure Password Fields**: Passwords are masked in forms
- **Token Display**: JWT tokens are displayed securely
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

### **Serve Production Build**

```bash
npx serve -s build
```

### **Docker Deployment**

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### **Common Issues**

1. **Backend Connection Error**

   - Ensure the backend is running on port 8080
   - Check CORS configuration in the backend

2. **Dropdown Data Not Loading**

   - Verify that entities exist in the database
   - Check browser console for API errors

3. **Form Submission Errors**
   - Check browser console for detailed error messages
   - Verify that all required fields are filled

### **Development Tips**

- Use browser developer tools to debug API calls
- Check the Network tab for request/response details
- Use React Developer Tools for component debugging

## 📞 Support

For issues or questions:

1. Check the browser console for error messages
2. Verify the backend is running and accessible
3. Ensure all dependencies are installed correctly

---

**Happy Administering! 🎉**
