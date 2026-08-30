import { prisma } from '../db';
import axios from 'axios';

export interface AiDecisionResult {
  rootCause: string;
  recoverability: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  recommendedAction: 'RETRY' | 'PAYMENT_LINK' | 'REMINDER' | 'ESCALATE' | 'NO_ACTION';
  reason: string;
}

export class AiDecisionEngine {
  /**
   * Main entry point to get a decision. Tries the LLM first, falls back to rules.
   */
  async analyzePayment(paymentId: string): Promise<AiDecisionResult> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        customer: true,
        failures: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!payment) throw new Error(`Payment ${paymentId} not found`);

    const context = {
      amount: payment.amount,
      customerSuccessCount: payment.customer.successCount,
      customerFailureCount: payment.customer.failureCount,
      recentFailureReason: payment.failures[0]?.reason || 'unknown',
      paymentStatus: payment.status
    };

    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.log('No valid Gemini API key found, using fallback rule engine.');
        return this.fallbackRuleEngine(context);
      }
      
      // Abstracted LLM Provider Call (Using Gemini via REST for simplicity)
      return await this.callGeminiAPI(context);
    } catch (error) {
      console.error('AI provider failed, falling back to rule engine.', error);
      return this.fallbackRuleEngine(context);
    }
  }

  private async callGeminiAPI(context: any): Promise<AiDecisionResult> {
    const prompt = `
      You are an AI Payment Revenue Recovery Agent. Analyze this failed payment context and recommend a recovery action.
      Context: ${JSON.stringify(context)}
      
      Return ONLY a JSON object with this exact schema (no markdown, no backticks):
      {
        "rootCause": "string (e.g. temporary_network_failure)",
        "recoverability": "HIGH" | "MEDIUM" | "LOW",
        "confidence": number (0 to 1),
        "recommendedAction": "RETRY" | "PAYMENT_LINK" | "REMINDER" | "ESCALATE" | "NO_ACTION",
        "reason": "string (brief explanation)"
      }
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      }
    );

    const rawText = response.data.candidates[0].content.parts[0].text;
    const result = JSON.parse(rawText) as AiDecisionResult;
    return result;
  }

  /**
   * Deterministic Fallback Engine
   * Ensures the system works even if the AI API is down or unconfigured.
   */
  private fallbackRuleEngine(context: any): AiDecisionResult {
    const reason = context.recentFailureReason;

    if (context.paymentStatus === 'SUCCESS') {
      return {
        rootCause: 'already_recovered',
        recoverability: 'LOW',
        confidence: 1.0,
        recommendedAction: 'NO_ACTION',
        reason: 'Payment is already successful.'
      };
    }

    if (reason === 'temporary_network_failure' || reason === 'timeout') {
      return {
        rootCause: reason,
        recoverability: 'HIGH',
        confidence: 0.9,
        recommendedAction: 'RETRY',
        reason: 'Temporary failures are highly recoverable via automated retry.'
      };
    }

    if (reason === 'expired_card' || reason === 'invalid_payment_method') {
      return {
        rootCause: reason,
        recoverability: 'MEDIUM',
        confidence: 0.85,
        recommendedAction: 'PAYMENT_LINK',
        reason: 'Payment method is permanently invalid; customer must provide a new one.'
      };
    }

    if (reason === 'demo_execution_fail') {
      return {
        rootCause: reason,
        recoverability: 'HIGH',
        confidence: 0.99,
        recommendedAction: 'PAYMENT_LINK',
        reason: 'Demo scenario for execution failure via payment link.'
      };
    }

    if (reason === 'bank_decline' && context.amount > 25000) {
      return {
        rootCause: reason,
        recoverability: 'MEDIUM',
        confidence: 0.75,
        recommendedAction: 'ESCALATE',
        reason: 'High value transaction declined by bank; requires human review.'
      };
    }

    return {
      rootCause: reason,
      recoverability: 'LOW',
      confidence: 0.6,
      recommendedAction: 'REMINDER',
      reason: 'Standard reminder for generic failure.'
    };
  }
}

export const aiDecisionEngine = new AiDecisionEngine();
