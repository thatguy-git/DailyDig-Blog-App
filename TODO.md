-   Cut blog title to a decent minimum in each of the cards A, B, C, D also give a pop up when creating stories to keep the title short and concise
-   The Bannercard should also have a snippet text i.e like the first 10 words of the actual story
-   The date format in the frontend wont match the format the backend will send fix
-   Post model should have intro
-   implement limits in the backend for sending posts to the frontend

## API Endpoints

### Auth Routes

-   [x] **POST /signup**: User registration - Creates a new user account with email, password, and other details. Returns user data and JWT token.
-   [x] **POST /login**: User login - Authenticates user with email and password. Returns user data and JWT token if successful.
-   [x] **POST /verify-otp**: Verify OTP for password reset - Verifies the OTP sent to user's email for password reset. Returns a temporary token if valid.
-   [x] **POST /send-otp**: Send OTP for password reset - Sends an OTP to the user's email for password reset.
-   [x] **POST /reset-password**: Reset password (protected) - Resets the user's password using a temporary token from OTP verification.
-   [x] **POST /verify-email-otp**: Verify email OTP - Verifies the OTP for email verification during signup. Marks user as verified and returns JWT token.

### Post Routes

-   [x] **GET /**: Get all published posts - Retrieves a list of all published blog posts, sorted by creation date. (Used in HomePage, BlogPage for displaying posts)
-   [x]**GET /:id**: Get single post by ID - Retrieves a specific post by its ID. Checks if post is published or user is the author. (Used in BlogPage for individual post view)
-   [x]**POST /**: Create new post (protected) - Creates a new blog post with title, content, tags, and publication status. Calculates estimated read time. (Used in WriteStory page)
-   [x]**PUT /:id**: Update post (protected) - Updates an existing post's title, content, tags, or publication status. Only the author can update. (Used in Dashboard Content Management)
-   [x]**DELETE /:id**: Delete post (protected) - Deletes a post by ID. Only the author can delete. (Used in Dashboard Content Management)
-   [x]**GET /user/posts**: Get user's own posts (protected) - Retrieves all posts (including drafts) created by the authenticated user. (Used in Dashboard)
-   [x]**POST /:id/like**: Like or unlike a post (protected) - Toggles like status on a post for the authenticated user. (Used in BlogCards for liking posts)
-   [x]**GET /search**: Search posts by query - Retrieves posts matching search criteria. (Needed for search functionality if implemented)
-   **GET /popular**: Get popular posts - Retrieves top posts by views/likes. (Used in BlogCardsB, BlogCardsD for "Most Popular")
-   **GET /featured**: Get featured posts - Retrieves editor-picked or featured posts. (Used in HomePageCardsSection for "Featured Stories")

### Comment Routes

-   [x]**POST /:postId/comments**: Create a new comment on a post (protected) - Adds a comment to a specific post. (Used in BlogPage for commenting)
-   **GET /:postId/comments**: Get all comments for a post - Retrieves comments for a post with pagination. (Used in BlogPage for displaying comments)
-   **PUT /:commentId**: Update a comment (protected) - Updates the content of a comment. Only the author can update. (Used in BlogPage if editing comments)
-   **DELETE /:commentId**: Delete a comment (protected) - Soft deletes a comment. Author or post author can delete. (Used in BlogPage for deleting comments)
-   **POST /:commentId/like**: Like or unlike a comment (protected) - Toggles like status on a comment for the authenticated user. (Used in BlogPage for liking comments)

### User Routes

-   [x] **GET /profile**: Get user profile (protected) - Retrieves the authenticated user's profile information. (Used in Dashboard)
-   [x] **PUT /profile**: Update user profile (protected) - Updates the authenticated user's name, username, or email. (Used in Dashboard)
-   [X]**GET /users**: Get all users (admin protected) - Retrieves list of all users for admin management. (Used in Dashboard User Management)
-   [x] **PUT /users/:id**: Update user (admin protected) - Updates a user's role, status, etc. (Used in Dashboard User Management)
-   [x] **DELETE /users/:id**: Delete user (admin protected) - Deletes a user account. (Used in Dashboard User Management)
-   [x] **POST /users**: Create user (admin protected) - Creates a new user account for admin. (Used in Dashboard User Management)
-   **GET /subscribers**: Get subscribers (admin protected) - Retrieves list of subscribers. (Used in Dashboard Analytics for "New Subscribers")

### Analytics Routes

-   **GET /analytics/stats**: Get analytics stats (admin protected) - Retrieves overall stats like page views, comments, shares, subscribers. (Used in Dashboard Analytics)
-   **GET /analytics/posts**: Get post analytics (admin protected) - Retrieves analytics for individual posts (views, shares, comments). (Used in Dashboard Analytics for top posts table)

### Upload Routes

-   [x] **POST /upload/profile-image**: Upload profile image (protected) - Uploads a profile image and updates user profile.
-   [x] **POST /upload/post-image**: Upload post featured image (protected) - Uploads a featured image for a blog post.
-   [x] **DELETE /upload/profile-image**: Delete profile image (protected) - Deletes the user's profile image.
-   [x] **DELETE /upload/post-image/:postId**: Delete post image (protected) - Deletes a post's featured image.

### Contact Routes

-   **POST /contact**: Send contact message - Sends a contact form message (optional, could be handled via email). (Used in ContactUs page)

### Security & Maintenance Routes

-   **GET /health**: Get system health - Returns system health status. (Used in Dashboard Security & Maintenance)
-   **GET /logs**: Get system logs (admin protected) - Retrieves recent logs for monitoring. (Used in Dashboard Security & Maintenance)

### Notification Routes

-   **GET /notifications**: Get notifications (admin protected) - Retrieves system notifications and alerts. (Used in Dashboard Notifications & Alerts)
