import express from "express";
import multer from "multer";
import path from "path";
import { parseSalesData } from "../services/data_parser.js";
import { generateSalesSummary } from "../services/llm_service.js";
import { sendSalesSummaryEmail } from "../services/email_service.js";
import { validateEmail, validateFileType } from "../utils/security.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!validateFileType(ext)) {
      return cb(new Error("Invalid file type. Only .csv and .xlsx are allowed."));
    }
    cb(null, true);
  },
});

router.post("/analyze-sales", upload.single("file"), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: "A valid recipient email is required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Sales file is required." });
    }

    const salesStats = await parseSalesData(req.file);
    const summary = await generateSalesSummary(salesStats);

    await sendSalesSummaryEmail({
      recipient: email,
      summary,
    });

    return res.json({
      message: "Sales summary generated and emailed successfully.",
      summary,
      stats: salesStats,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to process sales file." });
  }
});

export default router;

