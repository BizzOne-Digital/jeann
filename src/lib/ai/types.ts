export interface AssistantMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AssistantContext {
  locale?: string;
  pagePath?: string;
  productSlug?: string;
}

export interface AssistantReply {
  message: string;
  sources: string[];
  escalated: boolean;
  escalationType?: "rfq" | "contact" | "booking";
}

export interface AssistantProvider {
  readonly name: string;
  chat(messages: AssistantMessage[], context?: AssistantContext): Promise<AssistantReply>;
}
