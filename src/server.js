const { app, authenticateSpotify } = require('./index');

const PORT = process.env.PORT || 3000;

async function startServer() {
  await authenticateSpotify();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();