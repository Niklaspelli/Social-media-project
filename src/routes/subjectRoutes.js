import express from "express";
import { getSubjectsController } from "../controllers/forumcontroller/subject.controller.js";

const router = express.Router();

router.get("/", getSubjectsController);

export default router;
