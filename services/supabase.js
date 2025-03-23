import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Note: These values need to be set in environment variables in production
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Saves search results to Supabase
 * @param {string} keyword - The keyword that was searched
 * @param {Array} results - Array of search result objects
 * @returns {Promise<Object>} - Response from Supabase
 */
export const saveSearchResults = async (keyword, results) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not configured');
    return { error: 'Supabase credentials not configured' };
  }
  
  try {
    // Create a search session record
    const { data: session, error: sessionError } = await supabase
      .from('search_sessions')
      .insert({
        keyword,
        timestamp: new Date().toISOString(),
        result_count: results.length
      })
      .select('id')
      .single();
    
    if (sessionError) throw sessionError;
    
    // Insert all results with the session ID
    const resultsToInsert = results.map(result => ({
      session_id: session.id,
      title: result.title,
      url: result.url,
      description: result.description,
      date: result.date
    }));
    
    const { error: resultsError } = await supabase
      .from('search_results')
      .insert(resultsToInsert);
    
    if (resultsError) throw resultsError;
    
    return { success: true, session_id: session.id };
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    return { error: error.message };
  }
};

/**
 * Fetches recent search results from Supabase
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} - Array of search sessions with results
 */
export const fetchSearchResults = async (days = 7) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not configured');
    return [];
  }
  
  try {
    // Get timestamp for X days ago
    const date = new Date();
    date.setDate(date.getDate() - days);
    const fromDate = date.toISOString();
    
    // Get all search sessions from the past X days
    const { data: sessions, error: sessionsError } = await supabase
      .from('search_sessions')
      .select('id, keyword, timestamp, result_count')
      .gte('timestamp', fromDate)
      .order('timestamp', { ascending: false });
    
    if (sessionsError) throw sessionsError;
    
    // Get all results for these sessions
    const sessionIds = sessions.map(session => session.id);
    
    if (sessionIds.length === 0) {
      return [];
    }
    
    const { data: results, error: resultsError } = await supabase
      .from('search_results')
      .select('*')
      .in('session_id', sessionIds);
    
    if (resultsError) throw resultsError;
    
    // Combine sessions with their results
    const searchData = sessions.map(session => {
      const sessionResults = results.filter(r => r.session_id === session.id);
      return {
        keyword: session.keyword,
        timestamp: session.timestamp,
        results: sessionResults.map(r => ({
          title: r.title,
          url: r.url,
          description: r.description,
          date: r.date
        }))
      };
    });
    
    return searchData;
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return [];
  }
};

export default supabase;