import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text_content } = req.body || {};

  if (!text_content || typeof text_content !== 'string' || text_content.trim().length < 20) {
    return res.status(400).json({ error: 'text_too_short' });
  }

  const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data, error } = await db
    .from('requests')
    .insert({ text_content: text_content.trim() })
    .select('token')
    .single();

  if (error || !data) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'insert_failed' });
  }

  return res.status(200).json({ token: data.token });
}
