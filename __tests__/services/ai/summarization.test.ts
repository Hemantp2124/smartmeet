// __tests__/services/ai/summarization.test.ts
import { generateMeetingSummary, MeetingSummary } from '@/lib/services/ai/summarization';

// Mock OpenAI client
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: JSON.stringify({
                    title: "Test Meeting",
                    summary: "This is a test summary",
                    keyPoints: ["Point 1", "Point 2"],
                    actionItems: ["Action 1", "Action 2"],
                    nextSteps: ["Step 1", "Step 2"],
                    participants: ["John", "Jane"],
                    date: "2023-01-01"
                  })
                }
              }]
            })
          }
        }
      };
    })
  };
});

describe('AI Summarization Service', () => {
  describe('generateMeetingSummary', () => {
    it('should generate a meeting summary from transcript', async () => {
      const transcript = "This is a test transcript";
      const summary = await generateMeetingSummary(transcript);
      
      expect(summary).toBeDefined();
      expect(summary.title).toBe("Test Meeting");
      expect(summary.summary).toBe("This is a test summary");
      expect(summary.keyPoints).toHaveLength(2);
      expect(summary.actionItems).toHaveLength(2);
      expect(summary.nextSteps).toHaveLength(2);
      expect(summary.participants).toHaveLength(2);
      expect(summary.date).toBe("2023-01-01");
    });

    it('should handle empty transcript', async () => {
      const transcript = "";
      
      await expect(generateMeetingSummary(transcript))
        .rejects
        .toThrow('Failed to generate meeting summary');
    });

    it('should use custom options', async () => {
      const transcript = "This is a test transcript";
      const options = {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 500
      };
      
      const summary = await generateMeetingSummary(transcript, options);
      
      expect(summary).toBeDefined();
      expect(summary.title).toBe("Test Meeting");
    });
  });
});