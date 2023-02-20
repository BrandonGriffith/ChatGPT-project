import express from "express";
import cors from "cors";
import { Configuration, OpenAIAPI } from "openai";
import * as dotenv from 'dotenv';

dotenv.config();
const config = new Configuration( { apiKey : process.env.OPEN_AI_KEY } );
