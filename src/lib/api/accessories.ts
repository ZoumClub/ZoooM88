import { supabase } from '@/lib/supabase';
import type { Accessory } from '@/types/accessory';

export async function getAccessories(): Promise<Accessory[]> {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('visible', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching accessories:', error);
    throw error;
  }

  return data || [];
}

export async function getAccessoryById(id: string): Promise<Accessory> {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching accessory:', error);
    throw error;
  }

  return data;
}