import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { type dbClient, db } from "../db/index.js";
import { addChildrenToNotebook } from "../lib/add-children.js";

