import express from 'express';
// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
const dynamicRoutes = {};

app.use(cors(
  {
    origin: '*',
  }
));

app.get('/', (_, res) => {
  res.send('Hello World!');
});

console.log(process.env.GOOGLE_API_KEY);


async function generateContent(query) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `generate a json file for following data: ${query}. Only provide the JSON data without any additional text.`;
  
  const result = await model.generateContent(prompt);
  // console.log(result.response.text());
  const jsonResponse = await JSON.parse(result.response.text().trim().substring(8 , result.response.text().length - 4));
  console.log(jsonResponse);
  
  return jsonResponse;
  
}

app.post('/add-endpoint', (req, res) => {
  console.log(req.body);
  
  const { path = "dog", method = "get", query } = req.body;
  // const response = { message: 'Hello, World!' };


  if (!path || !method || !query) {
      return res.status(400).json({ error: 'Path, method, and response are required.' });
  }

  

  // Dynamically add the route
  app[method.toLowerCase()](path, async(_, res) => {
    const response = await generateContent(query);
    res.json(response);
  });

  // Optionally store the route configuration
  dynamicRoutes[path] = { method, query };
  console.log(dynamicRoutes);
  listEndpoints(app);
  res.status(201).json({ message: `Endpoint ${method.toUpperCase()} ${path} added successfully. ${process.env.GOOGLE_API_KEY}` });
});


// ...existing code...

const listEndpoints = (app) => {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) { // routes registered directly on the app
      console.log(`${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') { // router middleware 
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          console.log(`${route.stack[0].method.toUpperCase()} ${route.path}`);
        }
      });
    }
  });
};

// Call the function to list all endpoints


// ...existing code...

app.listen(process.env.PORT , () => {
  console.log("Server is running on port" , process.env.PORT);
  
});
