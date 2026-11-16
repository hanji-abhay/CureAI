import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter(req, file, callback) {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return callback(new Error('Only PDF, JPG and PNG files are supported.'));
    }

    callback(null, true);
  },
});

function handleUpload(req, res, next) {
  upload.single('report')(req, res, (error) => {
    if (!error) return next();

    const tooLarge = error.code === 'LIMIT_FILE_SIZE';

    return res.status(tooLarge ? 413 : 400).json({
      success: false,
      message: tooLarge
        ? 'The report must be 8 MB or smaller.'
        : error.message || 'Unable to process the uploaded file.',
    });
  });
}

async function preprocessImage(buffer) {
  return sharp(buffer)
    .rotate()
    .grayscale()
    .normalize()
    .resize({
      width: 2500,
      height: 2500,
      fit: 'inside',
      withoutEnlargement: false,
    })
    .sharpen()
    .png()
    .toBuffer();
}

function detectFileType(buffer) {
  if (
    buffer.length >= 5 &&
    buffer.subarray(0, 5).toString('ascii') === '%PDF-'
  ) {
    return 'pdf';
  }

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image';
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return 'image';
  }

  return null;
}

router.post('/', authMiddleware, handleUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF, JPG or PNG report.',
      });
    }

    const fileType = detectFileType(req.file.buffer);

    if (!fileType) {
      return res.status(400).json({
        success: false,
        message: 'The uploaded file is invalid or unsupported.',
      });
    }

    let extractedText = '';

    if (fileType === 'pdf') {
      const result = await pdfParse(req.file.buffer);
      extractedText = result.text || '';

      if (!extractedText.trim()) {
        return res.status(422).json({
          success: false,
          message:
            'No selectable text was found. Scanned PDFs are not supported yet. Please upload a JPG or PNG image of the report instead.',
        });
      }
    } else {
      const processedImage = await preprocessImage(req.file.buffer);
      const worker = await createWorker('eng');

      try {
        await worker.setParameters({
          tessedit_pageseg_mode: '6',
        });

        const result = await worker.recognize(processedImage);
        extractedText = result.data.text || '';
      } finally {
        await worker.terminate();
      }
    }

    extractedText = extractedText
      .replace(/\u0000/g, '')
      .trim()
      .slice(0, 30000);

    if (!extractedText) {
      return res.status(422).json({
        success: false,
        message: 'No readable text could be extracted from this report.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Report text extracted successfully.',
      fileType,
      extractedText,
      requiresUserReview: true,
      disclaimer:
        'Extracted information may contain errors. Verify all values against the original report. This tool does not provide a medical diagnosis.',
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Unable to extract text from this report right now.',
    });
  }
});

export default router;
