import OpenAI from 'openai';
import { logInfo, logError, logDebug } from '@/lib/utils/logger';
import { getAICache, setAICache, generateAICacheKey } from '@/lib/services/cache/aiCache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MeetingSummary {
  title: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  nextSteps: string[];
  participants?: string[];
  date?: string;
}

export async function generateMeetingSummary(
  transcript: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<MeetingSummary> {
  try {
    // Generate cache key based on transcript and options
    const cacheKey = generateAICacheKey('meeting-summary', `${transcript}-${JSON.stringify(options)}`);
    
    // Try to get from cache first
    const cachedResult = getAICache(cacheKey);
    if (cachedResult) {
      logInfo('Meeting summary retrieved from cache', { cacheKey });
      return cachedResult as MeetingSummary;
    }

    logInfo('Generating meeting summary', {
      transcriptLength: transcript.length,
      options
    });

    const model = options?.model || 'gpt-4';
    const temperature = options?.temperature ?? 0.3;
    const maxTokens = options?.maxTokens ?? 1000;

    const prompt = `Please analyze the following meeting transcript and provide a structured summary.
    Format your response as a JSON object with the following structure:
    {
      "title": "A concise title for the meeting",
      "summary": "A 3-4 sentence summary of the key discussion points and outcomes",
      "keyPoints": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "actionItems": ["Action item 1", "Action item 2"],
      "nextSteps": ["Next step 1", "Next step 2"],
      "participants": ["Participant 1", "Participant 2"],
      "date": "YYYY-MM-DD"
    }
    
    Here is the transcript:
    ${transcript}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that helps summarize meetings into structured data. Extract key information, action items, and next steps from the transcript.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens: maxTokens,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      const error = new Error('No content in the response from OpenAI');
      logError('OpenAI response missing content', error, { response });
      throw error;
    }

    logDebug('OpenAI response received', { contentLength: content.length });

    // Try to parse the JSON response
    try {
      const result = JSON.parse(content) as MeetingSummary;
      
      // Cache the result for 1 hour
      setAICache(cacheKey, result, 60 * 60 * 1000);
      
      logInfo('Meeting summary generated successfully', {
        title: result.title,
        keyPointsCount: result.keyPoints?.length,
        actionItemsCount: result.actionItems?.length
      });
      return result;
    } catch (error) {
      logError('Failed to parse OpenAI response', error, { content });
      throw new Error('Failed to parse the summary from OpenAI');
    }
  } catch (error) {
    logError('Error generating meeting summary', error);
    throw new Error('Failed to generate meeting summary');
  }
}
