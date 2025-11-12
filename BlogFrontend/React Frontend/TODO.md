-   Cut blog title to a decent minimum in each of the cards A, B, C, D also give a pop up when creating stories to keep the title short and concise
-   The Bannercard should also have a snippet text i.e like the first 10 words of the actual story
-   The date format in the frontend wont match the format the backend will send fix
-   Post model should have intro

## API Endpoints

### Auth Routes

-   **POST /signup**: User registration - Creates a new user account with email, password, and other details. Returns user data and JWT token.
-   **POST /login**: User login - Authenticates user with email and password. Returns user data and JWT token if successful.
-   **POST /verify-otp**: Verify OTP for password reset - Verifies the OTP sent to user's email for password reset. Returns a temporary token if valid.
-   **POST /send-otp**: Send OTP for password reset - Sends an OTP to the user's email for password reset.
-   **POST /reset-password**: Reset password (protected) - Resets the user's password using a temporary token from OTP verification.
-   **POST /verify-email-otp**: Verify email OTP - Verifies the OTP for email verification during signup. Marks user as verified and returns JWT token.

### Post Routes

-   **GET /**: Get all published posts - Retrieves a list of all published blog posts, sorted by creation date.
-   **GET /:id**: Get single post by ID - Retrieves a specific post by its ID. Checks if post is published or user is the author.
-   **POST /**: Create new post (protected) - Creates a new blog post with title, content, tags, and publication status. Calculates estimated read time.
-   **PUT /:id**: Update post (protected) - Updates an existing post's title, content, tags, or publication status. Only the author can update.
-   **DELETE /:id**: Delete post (protected) - Deletes a post by ID. Only the author can delete.
-   **GET /user/posts**: Get user's own posts (protected) - Retrieves all posts (including drafts) created by the authenticated user.
-   **POST /:id/like**: Like or unlike a post (protected) - Toggles like status on a post for the authenticated user.

### Comment Routes

-   **POST /:postId/comments**: Create a new comment on a post (protected) - Adds a comment to a specific post.
-   **GET /:postId/comments**: Get all comments for a post - Retrieves comments for a post with pagination.
-   **PUT /:commentId**: Update a comment (protected) - Updates the content of a comment. Only the author can update.
-   **DELETE /:commentId**: Delete a comment (protected) - Soft deletes a comment. Author or post author can delete.
-   **POST /:commentId/like**: Like or unlike a comment (protected) - Toggles like status on a comment for the authenticated user.

### User Routes

-   **GET /profile**: Get user profile (protected) - Retrieves the authenticated user's profile information.
-   **PUT /profile**: Update user profile (protected) - Updates the authenticated user's name, username, or email.
