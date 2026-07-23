import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();

// JSON Body Parser with increased limit for base64 dental images
app.use(express.json({ limit: '20mb' }));

// Initialize Gemini AI Client
const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const router = express.Router();

// 1. Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Dental Assistant API' });
});

// 2. Symptom Checker & Triage API
router.post('/dental/symptom-checker', async (req, res) => {
  try {
    const { toothNumber, painLevel, duration, symptoms, triggers, description } = req.body;

    const ai = getAi();
    const prompt = `You are a clinical dental AI triage specialist assisting a dental triage system.
Analyze the following patient report:
- Tooth Number (Universal Numbering 1-32): ${toothNumber ? '#' + toothNumber : 'Unspecified / General Mouth'}
- Reported Pain Level (1 to 10 scale): ${painLevel}/10
- Symptom Duration: ${duration || 'Not specified'}
- Selected Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}
- Pain Triggers: ${Array.isArray(triggers) ? triggers.join(', ') : triggers}
- Patient Description / Notes: ${description || 'None provided'}

Provide a structured clinical triage assessment in valid JSON format matching the schema.
Important guidelines:
- If pain is 8-10, involves facial swelling, fever, trauma, or severe bleeding, flag urgency as "EMERGENCY".
- If pain is 5-7 or involves acute hot/cold sensitivity that lingers, flag urgency as "PROMPT" (1-2 days).
- Otherwise flag as "ROUTINE".
- Keep medical advice professional, accurate, and include clear questions for the patient to ask their dentist.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert dental clinical triage assistant. Always return valid JSON matching the specified schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgency: {
              type: Type.STRING,
              description: 'Must be strictly "EMERGENCY", "PROMPT", or "ROUTINE"',
            },
            urgencyReason: {
              type: Type.STRING,
              description: 'Brief concise explanation why this urgency level was assigned.',
            },
            potentialConditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Clinical condition name (e.g. Irreversible Pulpitis, Periapical Abscess, Cracked Tooth Syndrome)' },
                  description: { type: Type.STRING, description: 'Patient-friendly explanation of what this condition is' },
                  likelihood: { type: Type.STRING, description: '"High", "Moderate", or "Low"' },
                },
              },
            },
            immediateActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Safe home care instructions prior to dental appointment (e.g. warm salt water rinse, OTC pain relief, ice pack)',
            },
            whatToAvoid: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actions/foods to avoid (e.g. heat on face, chewing on affected side, drinking through straws)',
            },
            questionsForDentist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 key questions the patient should ask during their visit',
            },
            recommendedProcedures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Potential dental diagnostic/treatment procedures (e.g., Periapical X-Ray, Vitality Test, Root Canal, Crown)',
            },
          },
          required: ['urgency', 'urgencyReason', 'potentialConditions', 'immediateActions', 'whatToAvoid', 'questionsForDentist'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (err: any) {
    console.error('Error in /api/dental/symptom-checker:', err);
    res.status(500).json({ error: err.message || 'Failed to generate symptom assessment.' });
  }
});

// 3. Interactive Dental Chat API
router.post('/dental/chat', async (req, res) => {
  try {
    const { messages, userRole } = req.body;
    const ai = getAi();

    const systemInstruction = userRole === 'clinician'
      ? `You are DentalAI, an expert clinical dental assistant advising dentists, hygienists, and dental assistants. 
Provide concise, clinically accurate information referencing ADA CDT dental codes, pharmacology, anesthetic dosages, endodontic/periodontal classifications, and post-op guidelines. Keep responses structured and clear.`
      : `You are DentalAI, a warm, empathetic, and knowledgeable dental health assistant. 
Explain dental procedures, oral hygiene habits, post-procedure recovery, toothaches, and dental care in plain, encouraging language. 
Always remind patients to consult their licensed dentist for official diagnosis.`;

    // Format messages for Gemini chat
    const formattedContents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Error in /api/dental/chat:', err);
    res.status(500).json({ error: err.message || 'Dental AI Chat error.' });
  }
});

// 4. SOAP Clinical Note Generator API (Clinician Tool)
router.post('/dental/soap-generator', async (req, res) => {
  try {
    const { chiefComplaint, clinicalObservations, radiographsTaken, toothNumbers, vitalSigns, proposedProcedure } = req.body;

    const ai = getAi();
    const prompt = `You are an expert dental clinical documentation software.
Generate a comprehensive, standardized SOAP clinical note based on the raw clinical details:
- Chief Complaint: ${chiefComplaint || 'None provided'}
- Tooth Number(s): ${Array.isArray(toothNumbers) ? toothNumbers.join(', ') : toothNumbers || 'General'}
- Clinical & Diagnostic Findings (Exam/Probe/Cold Test/Percussion): ${clinicalObservations || 'None provided'}
- Radiographic Findings: ${radiographsTaken || 'None taken/reviewed'}
- Vital Signs: ${vitalSigns || 'WNL (Within Normal Limits)'}
- Proposed/Completed Procedure: ${proposedProcedure || 'Consultation & Diagnosis'}

Return a JSON object strictly following the schema. Include appropriate ADA CDT dental procedure codes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You generate accurate clinical dental SOAP notes and CDT codes in JSON format.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjective: { type: Type.STRING, description: 'Subjective: Patient history, symptoms, onset, pain character' },
            objective: { type: Type.STRING, description: 'Objective: Visual exam, probing depths, cold/percussion testing, radiograph notes' },
            assessment: { type: Type.STRING, description: 'Assessment: Diagnosis and ICD/dental condition classification' },
            plan: { type: Type.STRING, description: 'Plan: Treatment provided or recommended, prescriptions, follow-up timeline' },
            cdtCodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING, description: 'ADA CDT Code e.g. D0120, D0220, D2391, D3330' },
                  title: { type: Type.STRING, description: 'Official CDT procedure description' },
                  feeEst: { type: Type.NUMBER, description: 'Estimated standard national fee' },
                },
              },
            },
            doctorSignaturePrompt: { type: Type.STRING, description: 'Attestation line e.g. "Drafted by Dental AI, reviewed and electronically signed by Dr. [Dentist Name]"' },
          },
          required: ['subjective', 'objective', 'assessment', 'plan', 'cdtCodes'],
        },
      },
    });

    const jsonText = response.text || '{}';
    res.json(JSON.parse(jsonText));
  } catch (err: any) {
    console.error('Error in /api/dental/soap-generator:', err);
    res.status(500).json({ error: err.message || 'Failed to generate SOAP note.' });
  }
});

// 5. Treatment Plan & Cost Estimator API
router.post('/dental/treatment-plan', async (req, res) => {
  try {
    const { diagnosisSummary, insuranceType } = req.body;
    const ai = getAi();

    const prompt = `You are a dental office treatment coordinator and financial estimator.
Create a phased treatment plan breakdown for the following diagnosis:
"${diagnosisSummary}"
Insurance Category: ${insuranceType || 'Standard PPO Insurance'}

Provide realistic US average CDT codes, estimated total fees, estimated insurance coverage %, and patient out-of-pocket costs.
Break procedures into logical phases (e.g. Phase 1 Urgent/Pain Relief, Phase 2 Restorative/Crowns, Phase 3 Preventive).
Return valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Return structured dental treatment plan and financial estimate in JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patientSummary: { type: Type.STRING, description: 'Patient friendly explanation of why these treatments are needed' },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  toothNumber: { type: Type.NUMBER, description: 'Tooth # (1-32) or null if full mouth' },
                  cdtCode: { type: Type.STRING, description: 'CDT Code e.g. D2750' },
                  procedureName: { type: Type.STRING, description: 'Name of treatment' },
                  priority: { type: Type.STRING, description: 'Immediate, Phase 1, Phase 2, or Elective' },
                  estimatedCost: { type: Type.NUMBER, description: 'Total standard fee' },
                  estimatedInsuranceCoverage: { type: Type.NUMBER, description: 'Estimated insurance contribution' },
                  notes: { type: Type.STRING, description: 'Why this procedure is necessary' },
                },
              },
            },
            totalCost: { type: Type.NUMBER },
            estInsurance: { type: Type.NUMBER },
            outOfPocket: { type: Type.NUMBER },
            recommendedPhases: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['patientSummary', 'items', 'totalCost', 'estInsurance', 'outOfPocket', 'recommendedPhases'],
        },
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Error in /api/dental/treatment-plan:', err);
    res.status(500).json({ error: err.message || 'Failed to build treatment plan.' });
  }
});

// 6. Dental Image / Intraoral Radiograph Analyzer API
router.post('/dental/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType, userNotes } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required.' });
    }

    const ai = getAi();
    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
      },
    };

    const textPart = {
      text: `Analyze this dental photo or radiograph sample for educational/preliminary assistance.
User Context/Notes: "${userNotes || 'General oral check'}"

Provide an educational AI observation report including:
1. Image Type (e.g., Intraoral photograph, Bitewing radiograph, Periapical x-ray, Panoramic, Smile photo).
2. Key Visual Landmarks Observed (e.g. enamel surface, gingival tissue tone, existing restorations like amalgam/composite, calculus deposits).
3. Potential Areas of Clinical Interest (e.g., potential interproximal discoloration, enamel wear, swollen papilla, margin irregularity).
4. Hygiene & Care Recommendations.
5. Disclaimer reminding user that this is AI educational triage, not a definitive radiographic diagnosis without in-person clinical exam.

Return valid JSON according to schema.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: 'You are an educational dental imaging AI analyzer. Provide clear visual observations in JSON format.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            imageType: { type: Type.STRING },
            landmarks: { type: Type.ARRAY, items: { type: Type.STRING } },
            potentialObservations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  region: { type: Type.STRING },
                  observation: { type: Type.STRING },
                  severity: { type: Type.STRING, description: 'Mild, Moderate, or Follow-up Recommended' },
                },
              },
            },
            hygieneRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            clinicianReviewNote: { type: Type.STRING },
          },
          required: ['imageType', 'landmarks', 'potentialObservations', 'hygieneRecommendations', 'clinicianReviewNote'],
        },
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Error in /api/dental/analyze-image:', err);
    res.status(500).json({ error: err.message || 'Image analysis failed.' });
  }
});

// Mount the router on multiple paths to handle development proxying AND any Netlify rewrites cleanly
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use('/.netlify/functions/api/api', router);
app.use('/', router);

export default app;
