/**
 * Root service/AIModal.js compatibility wrapper
 * Re-exports the unified Gemini 3.8 Flash client service
 */
import { AIChatSession, extractCleanJson, getDeterministicFallback } from '../src/service/AIModal';

export { AIChatSession, extractCleanJson, getDeterministicFallback };
export default AIChatSession;