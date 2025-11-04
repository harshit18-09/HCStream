import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller to handle video transcription using the provided Python script
export const transcribe = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const videoPath = req.file.path;
  const pythonScriptPath = path.join(__dirname, '../ai/transcribe.py');

  // Call the Python script. It prints the transcript text to stdout.
  execFile('python', [pythonScriptPath, videoPath], (error, stdout, stderr) => {
    // remove the temporary uploaded file
    fs.unlink(videoPath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    if (error) {
      console.error('Error executing Python script:', error, stderr);
      return res.status(500).json({ error: 'Error processing video' });
    }

    // stdout from transcribe.py is the plain transcript text
    const transcript = (stdout || '').toString().trim();
    return res.json({ transcript });
  });
};

// Basic heuristic-based suggestion generator.
// Accepts an image file (thumbnail) and optional reference text in req.body.reference
// Returns { titleSuggestion, descriptionSuggestion }
export const suggest = (req, res) => {
  console.log('[AI] suggest request body:', req.body);
  console.log('[AI] suggest request file:', req.file ? { originalname: req.file.originalname, path: req.file.path } : null);
  try {
    const referenceRaw = req.body && req.body.reference;
    const reference = referenceRaw ? String(referenceRaw).trim() : '';

    // prefer reference text if provided
    if (reference) {
      // create a short title from reference and a description
      const title = reference.split('\n')[0].slice(0, 80);
      const description = `About: ${reference}`;
      return res.json({ titleSuggestion: title, descriptionSuggestion: description });
    }

    // If a file was uploaded, attempt to extract keywords from the originalname
    const file = req.file;
    if (file && file.originalname) {
      // Use filename as a crude source of words
      const name = file.originalname.replace(/[_\-\.]+/g, ' ').replace(/\.[^/.]+$/, '');
      const words = name.split(/\s+/).filter(Boolean);
      const title = words.slice(0, 6).map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ') || 'Untitled Video';
      const description = `This video appears to be about ${words.slice(0, 10).join(' ')}.`;
      return res.json({ titleSuggestion: title, descriptionSuggestion: description });
    }

    // fallback suggestions
    return res.json({ titleSuggestion: 'My new video', descriptionSuggestion: 'Add a description that explains what viewers will see in this video.' });
  } catch (e) {
    console.error('Suggestion error', e);
    return res.status(500).json({ error: 'Failed to generate suggestions' });
  }
};
