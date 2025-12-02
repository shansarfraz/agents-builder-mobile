export interface Agent {
  id: string;
  name: string;
  description: string;
  context: string;
  instructions: string;
  knowledge: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentInput {
  name: string;
  description: string;
  context: string;
  instructions: string;
  knowledge: string;
}


