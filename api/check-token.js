import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS для локальной разработки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token } = req.body || {};

  if (!token || typeof token !== 'string' || token.trim().length < 8) {
    return res.status(400).json({ error: 'invalid_token' });
  }

  const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY  // service_role — только на сервере, клиент не видит
  );

  const { data, error } = await db
    .from('requests')
    .select('status')
    .eq('token', token.trim())
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'not_found' });
  }

  // Drive URL отдаётся клиенту ТОЛЬКО при approved — и только здесь
  if (data.status === 'approved') {
    return res.status(200).json({
      status: 'approved',
      url: process.env.DRIVE_URL
    });
  }

  // pending или rejected — статус без ссылки
  return res.status(200).json({ status: data.status });
}
