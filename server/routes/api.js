const express = require('express');
const { body, validationResult } = require('express-validator');
const { ensureAuthenticatedAPI } = require('../middleware/authMiddleware');
const router = express.Router();

// Node.js v18+ supports fetch natively. In case it is not supported in the user's environment:
const fetch = globalThis.fetch;

// POST /api/generate-image
router.post('/generate-image',
    ensureAuthenticatedAPI,
    [
        body('prompt')
            .trim()
            .isLength({ min: 3, max: 500 })
            .withMessage('Prompt must be between 3 and 500 characters.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { prompt, style } = req.body;
        const finalPrompt = style ? `${prompt}, ${style} style` : prompt;

        if (!fetch) {
            console.error('Server Environment Error: global fetch is not defined in this Node.js version.');
            return res.status(500).json({ error: 'Server Error: Node.js environment fetch is not supported.' });
        }

        try {
            const encodedPrompt = encodeURIComponent(finalPrompt);
            const seed = Math.floor(Math.random() * 1000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;

            const response = await fetch(imageUrl);
            if (!response.ok) {
                console.error('Pollinations AI Error status:', response.status);
                return res.status(500).json({ error: 'Image generation failed, please try again' });
            }

            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');

            return res.json({
                success: true,
                image: `data:image/jpeg;base64,${base64}`
            });

        } catch (error) {
            console.error('Unhandled server exception in /api/generate-image:', error);
            return res.status(500).json({ error: 'Image generation failed, please try again' });
        }
    }
);

// POST /api/edit-image
router.post('/edit-image',
    ensureAuthenticatedAPI,
    [
        body('editPrompt')
            .trim()
            .isLength({ min: 3, max: 500 })
            .withMessage('Prompt must be between 3 and 500 characters.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { editPrompt, originalDescription } = req.body;
        const finalPrompt = `${originalDescription || 'image'}, ${editPrompt}, photorealistic, detailed`;

        if (!fetch) {
            console.error('Server Environment Error: global fetch is not defined.');
            return res.status(500).json({ error: 'Server Error: Node.js environment fetch is not supported.' });
        }

        try {
            const encodedPrompt = encodeURIComponent(finalPrompt);
            const seed = Math.floor(Math.random() * 1000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;

            const response = await fetch(imageUrl);
            if (!response.ok) {
                console.error('Pollinations AI Edit Error status:', response.status);
                return res.status(500).json({ error: 'Image generation failed, please try again' });
            }

            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');

            return res.json({
                success: true,
                image: `data:image/jpeg;base64,${base64}`
            });
        } catch (error) {
            console.error('Unhandled server exception in /api/edit-image:', error);
            return res.status(500).json({ error: 'Image generation failed, please try again' });
        }
    }
);

// POST /api/style-transfer
router.post('/style-transfer',
    ensureAuthenticatedAPI,
    [
        body('prompt')
            .trim()
            .isLength({ min: 3, max: 500 })
            .withMessage('Prompt must be between 3 and 500 characters.'),
        body('style')
            .trim()
            .notEmpty()
            .withMessage('Art style must be selected.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { prompt, style } = req.body;
        const finalPrompt = `${prompt}, in the style of ${style}, masterpiece, detailed`;

        if (!fetch) {
            console.error('Server Environment Error: global fetch is not defined.');
            return res.status(500).json({ error: 'Server Error: Node.js environment fetch is not supported.' });
        }

        try {
            const encodedPrompt = encodeURIComponent(finalPrompt);
            const seed = Math.floor(Math.random() * 1000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;

            const response = await fetch(imageUrl);
            if (!response.ok) {
                console.error('Pollinations AI Style Transfer Error status:', response.status);
                return res.status(500).json({ error: 'Image generation failed, please try again' });
            }

            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');

            return res.json({
                success: true,
                image: `data:image/jpeg;base64,${base64}`
            });
        } catch (error) {
            console.error('Unhandled server exception in /api/style-transfer:', error);
            return res.status(500).json({ error: 'Image generation failed, please try again' });
        }
    }
);

// POST /api/batch-generate
router.post('/batch-generate',
    ensureAuthenticatedAPI,
    [
        body('prompts')
            .isArray({ min: 1, max: 5 })
            .withMessage('Provide between 1 and 5 prompts in an array.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { prompts, style } = req.body;

        if (!fetch) {
            console.error('Server Environment Error: global fetch is not defined.');
            return res.status(500).json({ error: 'Server Error: Node.js environment fetch is not supported.' });
        }

        const base64Images = [];

        for (let i = 0; i < prompts.length; i++) {
            const currentPrompt = prompts[i].trim();
            if (!currentPrompt) continue;

            const finalPrompt = style ? `${currentPrompt}, ${style} style` : currentPrompt;

            try {
                const encodedPrompt = encodeURIComponent(finalPrompt);
                const seed = Math.floor(Math.random() * 1000000);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;

                const response = await fetch(imageUrl);
                if (!response.ok) {
                    console.error(`Pollinations AI Batch Error for prompt ${i}:`, response.status);
                    continue; // Skip this one, try the rest
                }

                const buffer = await response.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                base64Images.push(`data:image/jpeg;base64,${base64}`);
            } catch (err) {
                console.error(`Unhandled exception in batch generation for prompt ${i}:`, err);
                continue; // Skip this one, try the rest
            }
        }

        return res.json({
            success: true,
            images: base64Images
        });
    }
);

// POST /api/save-preferences
router.post('/save-preferences', ensureAuthenticatedAPI, async (req, res) => {
  try {
    console.log('[save-preferences] Request received');
    console.log('[save-preferences] User:', req.user?.id);
    console.log('[save-preferences] Body:', req.body);
    
    const { preferences } = req.body;
    
    if (!preferences || typeof preferences !== 'object') {
      console.warn('[save-preferences] Invalid preferences');
      return res.status(400).json({ error: 'Invalid preferences' });
    }
    
    if (!req.user || !req.user.id) {
      console.error('[save-preferences] User missing ID');
      return res.status(401).json({ error: 'User not authenticated properly' });
    }
    
    console.log('[save-preferences] Calling updateUserPreferences...');
    const userStore = require('../utils/userStore');
    await userStore.updateUserPreferences(req.user.id, preferences);
    console.log('[save-preferences] Update complete, sending response');
    
    // Also update the session user object so the change is immediate
    req.user.preferences = preferences;
    
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[save-preferences] CRITICAL ERROR:', err);
    console.error('[save-preferences] Stack:', err.stack);
    return res.status(500).json({ error: 'Could not save preferences', details: err.message });
  }
});

module.exports = router;
