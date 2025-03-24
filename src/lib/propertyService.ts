import { supabase } from './supabaseClient';
import type { Property } from '../types/database';

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async searchProperties(query: string): Promise<Property[]> {
    try {
      // Extract property details from the query if it's a contextualized query
      const propertyMatch = query.match(/property "([^"]+)" located at ([^"]+) priced at \$(\d+)/i);
      
      if (propertyMatch) {
        const [, title, location] = propertyMatch;
        // Search by title
        const titleQuery = await supabase
          .from('properties')
          .select('*')
          .ilike('title', `%${title}%`);

        if (titleQuery.error) throw titleQuery.error;
        
        // If no results by title, try location
        if (!titleQuery.data?.length) {
          const locationQuery = await supabase
            .from('properties')
            .select('*')
            .ilike('location', `%${location}%`);

          if (locationQuery.error) throw locationQuery.error;
          return locationQuery.data || [];
        }

        return titleQuery.data;
      }

      // Handle regular search queries
      const bedroomsMatch = query.match(/(\d+)\s*bhk/i);
      const priceMatch = query.match(/(\d+(?:\.\d+)?)\s*(crore|lakh|k|million)/i);
      const locationMatch = query.match(/in\s+([a-zA-Z\s,]+)/i);
      
      let baseQuery = supabase.from('properties').select('*');

      if (bedroomsMatch) {
        baseQuery = baseQuery.eq('bedrooms', parseInt(bedroomsMatch[1]));
      }

      if (locationMatch) {
        const location = locationMatch[1].trim();
        baseQuery = baseQuery.ilike('location', `%${location}%`);
      }

      if (priceMatch) {
        let price = parseFloat(priceMatch[1]);
        const unit = priceMatch[2].toLowerCase();
        
        switch (unit) {
          case 'crore':
            price *= 10000000;
            break;
          case 'lakh':
            price *= 100000;
            break;
          case 'k':
            price *= 1000;
            break;
          case 'million':
            price *= 1000000;
            break;
        }
        
        baseQuery = baseQuery.lte('price', price);
      }

      const { data, error } = await baseQuery.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }
};