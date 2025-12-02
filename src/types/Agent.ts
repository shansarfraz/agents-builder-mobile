export type AgentStatus = "active" | "draft" | "archived";
export type AgentCategory =
  | "customer-support"
  | "sales"
  | "content"
  | "analysis"
  | "development"
  | "general";

export interface Agent {
  id: string;
  name: string;
  description: string;
  context: string;
  instructions: string;
  knowledge: string;
  category?: AgentCategory;
  status?: AgentStatus;
  tags?: string[];
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentInput {
  name: string;
  description: string;
  context: string;
  instructions: string;
  knowledge: string;
  category?: AgentCategory;
  status?: AgentStatus;
  tags?: string[];
  icon?: string;
  color?: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: AgentCategory;
  context: string;
  instructions: string;
  knowledge: string;
  tags: string[];
}
