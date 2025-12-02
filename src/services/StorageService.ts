import { supabase } from '../config/supabase';
import { Agent, CreateAgentInput } from '../types/Agent';
import { RealtimeChannel } from '@supabase/supabase-js';

class StorageService {
  private realtimeChannel: RealtimeChannel | null = null;

  /**
   * Get all agents from Supabase
   */
  async getAllAgents(): Promise<Agent[]> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading agents:', error);
        return [];
      }

      // Map Supabase snake_case to camelCase
      return (data || []).map(this.mapSupabaseToAgent);
    } catch (error) {
      console.error('Error loading agents:', error);
      return [];
    }
  }

  /**
   * Get a single agent by ID
   */
  async getAgentById(id: string): Promise<Agent | null> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading agent:', error);
        return null;
      }

      return data ? this.mapSupabaseToAgent(data) : null;
    } catch (error) {
      console.error('Error loading agent:', error);
      return null;
    }
  }

  /**
   * Create a new agent
   */
  async createAgent(input: CreateAgentInput): Promise<Agent> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .insert([
          {
            name: input.name,
            description: input.description,
            context: input.context,
            instructions: input.instructions,
            knowledge: input.knowledge,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating agent:', error);
        throw error;
      }

      return this.mapSupabaseToAgent(data);
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  /**
   * Update an existing agent
   */
  async updateAgent(id: string, input: Partial<CreateAgentInput>): Promise<Agent | null> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .update({
          ...(input.name && { name: input.name }),
          ...(input.description && { description: input.description }),
          ...(input.context && { context: input.context }),
          ...(input.instructions && { instructions: input.instructions }),
          ...(input.knowledge && { knowledge: input.knowledge }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating agent:', error);
        return null;
      }

      return data ? this.mapSupabaseToAgent(data) : null;
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  }

  /**
   * Delete an agent
   */
  async deleteAgent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting agent:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      return false;
    }
  }

  /**
   * Subscribe to real-time changes
   */
  subscribeToAgents(
    callback: (payload: { eventType: string; new: Agent; old: Agent }) => void
  ): RealtimeChannel {
    this.realtimeChannel = supabase
      .channel('agents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents',
        },
        (payload: any) => {
          console.log('Realtime event:', payload);
          callback({
            eventType: payload.eventType,
            new: payload.new ? this.mapSupabaseToAgent(payload.new) : ({} as Agent),
            old: payload.old ? this.mapSupabaseToAgent(payload.old) : ({} as Agent),
          });
        }
      )
      .subscribe();

    return this.realtimeChannel;
  }

  /**
   * Unsubscribe from real-time changes
   */
  unsubscribeFromAgents(): void {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }

  /**
   * Map Supabase response (snake_case) to Agent type (camelCase)
   */
  private mapSupabaseToAgent(data: any): Agent {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      context: data.context,
      instructions: data.instructions,
      knowledge: data.knowledge,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export default new StorageService();



