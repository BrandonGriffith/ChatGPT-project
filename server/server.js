import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";

dotenv.config();
const openConfig = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
const openai = new OpenAIApi(openConfig);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    console.log('running get');
    res.status(200).send({
        message: "Hello World"
    })
});
let messages = [{
    "role": "system",
    "content": "You are an assistant."
}];
app.post('/', async (req, res) => {
    console.log(messages , 'posting messages');
    if (messages.length > 5) {
        console.log("deleting messages older than 5");
        messages = messages.slice(-5);
    }
    try {
        let prompt = req.body.prompt;
        if (!prompt) {
            throw new Error("Prompt is required");
        }
        prompt = {
            "role": "user",
            "content": `${prompt}`
        }
        const response = await openai.createChatCompletion({
            "model": "gpt-3.5-turbo-1106",
        "messages": [
            ...messages,
            prompt
        ],
        });
        messages.push(response.data.choices[0].message);
        console.log(response.data.choices[0].message, 'new message');
        res.status(200).send({
            bot: response.data.choices[0].message,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message || "Something went wrong");
    }
});

app.listen(5000, () => console.log("Server is running on port http://localhost:5000"));
