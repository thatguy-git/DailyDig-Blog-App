-   Cut blog title to a decent minimum in each of the cards A, B, C, D also give a pop up when creating stories to keep the title short and concise
-   The Bannercard should also have a snippet text i.e like the first 10 words of the actual story
-   The date format in the frontend wont match the format the backend will send fix
-   Post model should have intro
-   implement limits in the backend for sending posts to the frontend

## API Endpoints

### Auth Routes

-   [x] **POST /api/auth/signup**: User registration - Creates a new user account with email, password, and other details. Returns user data and JWT token.
-   [x] **POST /api/auth/login**: User login - Authenticates user with email and password. Returns user data and JWT token if successful.
-   [x] **POST /api/auth/verify-otp**: Verify OTP for password reset - Verifies the OTP sent to user's email for password reset. Returns a temporary token if valid.
-   [x] **POST /api/auth/send-otp**: Send OTP for password reset - Sends an OTP to the user's email for password reset.
-   [x] **POST /api/auth/reset-password**: Reset password (protected) - Resets the user's password using a temporary token from OTP verification.
-   [x] **POST /api/auth/verify-email-otp**: Verify email OTP - Verifies the OTP for email verification during signup. Marks user as verified and returns JWT token.

### Post Routes

-   [x] **GET /api/posts/**: Get all published posts - Retrieves a list of all published blog posts, sorted by creation date. (Used in HomePage, BlogPage for displaying posts)
-   [x] **GET /api/posts/:id**: Get single post by ID - Retrieves a specific post by its ID. Checks if post is published or user is the author. (Used in BlogPage for individual post view)
-   [x] **POST /api/posts/**: Create new post (protected) - Creates a new blog post with title, content, tags, and publication status. Calculates estimated read time. (Used in WriteStory page)
-   [x] **PUT /api/posts/:id**: Update post (protected) - Updates an existing post's title, content, tags, or publication status. Only the author can update. (Used in Dashboard Content Management)
-   [x] **DELETE /api/posts/:id**: Delete post (protected) - Deletes a post by ID. Only the author can delete. (Used in Dashboard Content Management)
-   [x] **GET /api/posts/user/posts**: Get user's own posts (protected) - Retrieves all posts (including drafts) created by the authenticated user. (Used in Dashboard)
-   [x] **POST /api/posts/:id/like**: Like or unlike a post (protected) - Toggles like status on a post for the authenticated user. (Used in BlogCards for liking posts)
-   [ ] **GET /api/posts/search**: Search posts by query - Retrieves posts matching search criteria. (Needed for search functionality if implemented)
-   [ ] **GET /api/posts/popular**: Get popular posts - Retrieves top posts by views/likes. (Used in BlogCardsB, BlogCardsD for "Most Popular")
-   [ ] **GET /api/posts/featured**: Get featured posts - Retrieves editor-picked or featured posts. (Used in HomePageCardsSection for "Featured Stories")

### Comment Routes

-   [x] **POST /api/comments/:postId/comments**: Create a new comment on a post (protected) - Adds a comment to a specific post. (Used in BlogPage for commenting)
-   [x] **GET /api/comments/:postId/comments**: Get all comments for a post - Retrieves comments for a post with pagination. (Used in BlogPage for displaying comments)
-   [x] **PUT /api/comments/:commentId**: Update a comment (protected) - Updates the content of a comment. Only the author can update. (Used in BlogPage if editing comments)
-   [x] **DELETE /api/comments/:commentId**: Delete a comment (protected) - Soft deletes a comment. Author or post author can delete. (Used in BlogPage for deleting comments)
-   [x] **POST /api/comments/:commentId/like**: Like or unlike a comment (protected) - Toggles like status on a comment for the authenticated user. (Used in BlogPage for liking comments)

### User Routes

-   [x] **GET /api/user/profile**: Get user profile (protected) - Retrieves the authenticated user's profile information. (Used in Dashboard)
-   [x] **PUT /api/user/profile**: Update user profile (protected) - Updates the authenticated user's name, username, or email. (Used in Dashboard)
-   [x] **GET /api/admin/users**: Get all users (admin protected) - Retrieves list of all users for admin management. (Used in Dashboard User Management)
-   [x] **PUT /api/admin/users/:id**: Update user (admin protected) - Updates a user's role, status, etc. (Used in Dashboard User Management)
-   [x] **DELETE /api/admin/users/:id**: Delete user (admin protected) - Deletes a user account. (Used in Dashboard User Management)
-   [x] **POST /api/admin/users**: Create user (admin protected) - Creates a new user account for admin. (Used in Dashboard User Management)
-   [ ] **GET /api/admin/subscribers**: Get subscribers (admin protected) - Retrieves list of subscribers. (Used in Dashboard Analytics for "New Subscribers")

### Analytics Routes

-   [ ] **GET /api/admin/analytics/stats**: Get analytics stats (admin protected) - Retrieves overall stats like page views, comments, shares, subscribers. (Used in Dashboard Analytics)
-   [ ] **GET /api/admin/analytics/posts**: Get post analytics (admin protected) - Retrieves analytics for individual posts (views, shares, comments). (Used in Dashboard Analytics for top posts table)

### Upload Routes

-   [x] **POST /api/upload/profile-image**: Upload profile image (protected) - Uploads a profile image and updates user profile.
-   [x] **POST /api/upload/post-image**: Upload post featured image (protected) - Uploads a featured image for a blog post.
-   [x] **DELETE /api/upload/profile-image**: Delete profile image (protected) - Deletes the user's profile image.
-   [x] **DELETE /api/upload/post-image/:postId**: Delete post image (protected) - Deletes a post's featured image.

### Contact Routes

-   [ ] **POST /api/contact**: Send contact message - Sends a contact form message (optional, could be handled via email). (Used in ContactUs page)

### Security & Maintenance Routes

-   [ ] **GET /api/admin/health**: Get system health - Returns system health status. (Used in Dashboard Security & Maintenance)
-   [ ] **GET /api/admin/logs**: Get system logs (admin protected) - Retrieves recent logs for monitoring. (Used in Dashboard Security & Maintenance)

### Notification Routes

-   [ ] **GET /api/admin/notifications**: Get notifications (admin protected) - Retrieves system notifications and alerts. (Used in Dashboard Notifications & Alerts)
