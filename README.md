# 📝 Open Blog CMS

**Open Blog CMS** is a lightweight, efficient Content Management System built for learning and demonstrating the power of combining **Spring Boot 3** with pure **Vanilla JavaScript**.

The project features a hybrid architecture: the application skeleton is Server-Side Rendered (Thymeleaf), while interactions, content loading, and theme management are handled dynamically on the client-side (SPA-like experience), ensuring high performance and a smooth user experience.

## ✨ Key Features

### 1. 🎨 Dynamic Theme Engine
A unique feature of this CMS.
* **Live Editing:** Change colors in the admin panel and see the results instantly (powered by CSS Variables).
* **Persistence:** Theme configuration is saved in the database (global for all users) and cached in the browser's `localStorage` (for instant loading).
* **Presets:** Includes built-in themes (Light, Dark, Solarized, Colorful).

### 2. 📝 Content Management
* **WYSIWYG Editor:** Integrated **Quill.js** library allows for rich text formatting, lists, and headers.
* **HTML Mode:** Advanced users can edit the post's source HTML directly.
* **Statuses:** Posts can be published immediately or saved as drafts.

### 3. 🖼️ Custom Media Handling
* **Database Storage:** Images are stored directly in the database as `LONGBLOB` (Binary Large Object) instead of the file system.
* **Image API:** A dedicated controller serves images via endpoints (e.g., `/api/images/15`), keeping the post content clean (lightweight links instead of heavy Base64 strings).
* **Avatar Upload:** Authors can upload a profile picture displayed in the sidebar.

### 4. ⚙️ Configuration & Users
* **Global Settings:** Change the blog title, descriptions, and header alignment via the admin panel without touching the code.
* **Roles:** Simple permission system (Guest, Administrator).
* **Security:** Custom session handling logic and protected admin views.

---

## 🛠️ Tech Stack

**Backend:**
* **Java 17**
* **Spring Boot 3** (Web, Data JPA)
* **Hibernate** (ORM)
* **MariaDB / MySQL** (Database)
* **Maven** (Build tool)

**Frontend:**
* **Thymeleaf** (Server-side Java template engine)
* **Vanilla JavaScript** (Application logic, REST API communication)
* **CSS3 Custom Properties** (Variables for theming)
* **Quill.js** (Rich Text Editor)
* **Fontello** (Icon font based on Font Awesome - SIL License)

---

## 🚀 Installation & Setup

### Prerequisites
* JDK 17 or higher
* MariaDB or MySQL database

### 1: Database Configuration
Create an empty database (e.g., `openblog`). Then, configure the connection in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mariadb://localhost:3306/openblog
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Large file handling (Images)
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10M
```

### 2: Running the Application

Run the following command in the project root directory:

### Linux / macOS
```bash
./mvnw spring-boot:run
```

### Windows
```bash
mvnw.cmd spring-boot:run
```

### 3: First Login

On the first run, if the users table is empty, the system automatically creates a default administrator account:
- **Username:** admin
- **Password:** admin123

Log in at `http://localhost:8080/admin` and change the password in the "Account Settings" panel immediately for security.

---

### Project Structure

```
src/main/java/com/github/openblogcms
├── config/          # Data initialization (creating default admin)
├── controller/      # View Controllers (MVC) and API Controllers (REST)
├── model/           # JPA Entities (User, Post, Image, Config, ThemeConfig)
├── repository/      # Data access interfaces
└── service/         # Business logic (e.g., ConfigService)

src/main/resources
├── static/
│   ├── css/         # Styles and fonts
│   └── js/          # Main frontend logic (app.js)
└── templates/       # HTML Views (Thymeleaf)
    ├── admin/       # Admin panel views
    └── ...          # Home, Login, Layout, Error pages
```

---
## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📦 Third-Party Assets

### Icons
This project uses **Fontello** - a custom icon font built with selected glyphs from:
* **Font Awesome** by Dave Gandy
* Licensed under **SIL Open Font License**
* Homepage: [Font Awesome](https://github.com/FortAwesome/Font-Awesome)

The icon font files are located in `src/main/resources/static/css/fontello/`.

### Quill.js
This project uses **Quill.js** - a modern WYSIWYG editor built for compatibility
* Licensed under **BSD-3-Clause License**
* Homepage: [Quill.js](https://quilljs.com/)
* GitHub: [slab/quill](https://github.com/slab/quill)
---
