# AlphaLearn3 LMS

AlphaLearn3 LMS is a Learning Management System designed to enhance the learning experience by generating and serving questions using OpenAI. This project integrates various technologies to provide a seamless and interactive educational platform.

## Features

- **Question Generation:** Uses OpenAI to generate questions based on the provided learning materials.
- **Question Serving:** Efficiently serves generated questions to the users.
- **User Authentication:** Secure user authentication using JWT.
- **Email Notifications:** Sends notifications to users via email.
- **Rate Limiting:** Implements rate limiting to prevent abuse.
- **Responsive Design:** User-friendly interface built with React.

## Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/yourusername/alphalearn3-lms.git
   cd alphalearn3-lms
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```sh
   PORT=your_port
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_pass
   ```

4. **Start the Server**

   ```sh
   npm start
   ```

## Scripts

- **Start the Server**

  ```sh
  npm start
  ```

- **Debug the Server**

  ```sh
  npm run debug
  ```

- **Build the React Application**

  ```sh
  npm run build
  ```

- **Eject the React Application**

  ```sh
  npm run eject
  ```

## Dependencies

- **axios:** ^1.5.0
- **bcryptjs:** ^2.4.3
- **body-parser:** ^1.20.2
- **cors:** ^2.8.5
- **crypto:** ^1.0.1
- **dotenv:** ^16.3.1
- **express:** ^4.18.2
- **express-async-handler:** ^1.2.0
- **express-rate-limit:** ^7.1.3
- **html-to-text:** ^9.0.5
- **jsonwebtoken:** ^9.0.2
- **mongodb:** ^6.1.0
- **mongoose:** ^7.5.2
- **nodemailer:** ^6.9.7
- **nodemon:** ^3.0.1
- **pug:** ^3.0.2
- **react:** ^18.2.0
- **uuidv4:** ^6.2.13

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Victor Ifeanyi Chukwujiobi - chukwujiobivictoric@gmail.com

Project Link: [https://github.com/Victoric3/king-s-heart-cbt/edit/main]
