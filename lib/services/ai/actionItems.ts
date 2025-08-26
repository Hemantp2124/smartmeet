import OpenAI from 'openai';
import { logInfo, logError, logDebug } from '@/lib/utils/logger';
import { getAICache, setAICache, generateAICacheKey } from '@/lib/services/cache/aiCache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
}

export async function extractActionItems(
  transcript: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<ActionItem[]> {
  try {
    // Generate cache key based on transcript and options
    const cacheKey = generateAICacheKey('action-items', `${transcript}-${JSON.stringify(options)}`);
    
    // Try to get from cache first
    const cachedResult = getAICache(cacheKey);
    if (cachedResult) {
      logInfo('Action items retrieved from cache', { cacheKey });
      return cachedResult as ActionItem[];
    }

    logInfo('Extracting action items from transcript', {
      transcriptLength: transcript.length,
      options
    });

    const model = options?.model || 'gpt-4';
    const temperature = options?.temperature ?? 0.3;
    const maxTokens = options?.maxTokens ?? 1000;

    const prompt = `Analyze the following meeting transcript and extract action items.
    Format your response as a JSON array of action items with the following structure:
    [
      {
        "task": "The specific task to be done",
        "assignee": "Person responsible (or 'Team' if not specified)",
        "dueDate": "YYYY-MM-DD or 'ASAP' if not specified",
        "priority": "low/medium/high",
        "status": "pending",
        "notes": "Any additional context or details"
      }
    ]
    
    Here is the transcript:
    ${transcript}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that extracts action items from meeting transcripts. Be specific and actionable in your extractions.'
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
      const actionItems = JSON.parse(content) as ActionItem[];
      // Add IDs to each action item
      const result = actionItems.map((item, index) => ({
        ...item,
        id: `action-${Date.now()}-${index}`,
        status: 'pending' as const,
        priority: (item.priority || 'medium') as 'low' | 'medium' | 'high',
        assignee: item.assignee || 'Unassigned'
      }));
      
      // Cache the result for 1 hour
      setAICache(cacheKey, result, 60 * 60 * 1000);
      
      logInfo('Action items extracted successfully', {
        count: result.length
      });
      return result;
    } catch (error) {
      logError('Failed to parse OpenAI response', error, { content });
      throw new Error('Failed to parse the action items from OpenAI');
    }
  } catch (error) {
    logError('Error extracting action items', error);
    throw new Error('Failed to extract action items');
  }
}
