require('dotenv').config();
require('./database/db').connect();
const express = require('express');
const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');

const app = express();

app.use(express.json({ limit: '50mb' }));
const PORT = process.env.PORT || 8000;

app.use('/user', userRouter);
app.use('/posts', postRouter);

// This should be the last route else any route after it won't work
app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: 404,
      message: 'You reached a route that is not defined on this server',
    },
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
