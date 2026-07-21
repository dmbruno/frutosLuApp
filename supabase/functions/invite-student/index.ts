// Edge Function: invita a una alumna nueva por email y crea su perfil con un
// período de acceso inicial en días. Corre en el servidor porque crear un
// usuario de Auth para otra persona requiere la service_role key, que nunca
// puede vivir en el navegador. SUPABASE_URL, SUPABASE_ANON_KEY y
// SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automáticamente en runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'No autorizado' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Cliente con el JWT de quien llama, solo para saber quién es.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user: caller },
      error: callerError,
    } = await callerClient.auth.getUser();
    if (callerError || !caller) {
      return jsonResponse({ error: 'No autorizado' }, 401);
    }

    // Cliente con service_role para verificar el rol y crear el nuevo usuario.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: callerProfile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single();

    if (callerProfile?.role !== 'admin') {
      return jsonResponse({ error: 'Solo un admin puede invitar alumnas' }, 403);
    }

    const { email, full_name, days } = await req.json();
    if (!email || !full_name || !days || Number(days) <= 0) {
      return jsonResponse({ error: 'Faltan datos: email, nombre y días (mayor a 0)' }, 400);
    }

    const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email);
    if (inviteError || !invited.user) {
      return jsonResponse({ error: inviteError?.message ?? 'No se pudo invitar a la alumna' }, 400);
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(days));

    const { error: profileError } = await adminClient.from('profiles').insert({
      id: invited.user.id,
      full_name,
      role: 'alumno',
      subscription_status: 'active',
      subscription_expires_at: expiresAt.toISOString().slice(0, 10),
    });
    if (profileError) {
      return jsonResponse({ error: profileError.message }, 400);
    }

    return jsonResponse({ ok: true, userId: invited.user.id }, 200);
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});
