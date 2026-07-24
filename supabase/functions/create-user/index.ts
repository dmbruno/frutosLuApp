// Edge Function: crea un usuario nuevo (alumno o admin) con email + contraseña
// puestos por la profe, sin pasar por magic link. Corre en el servidor porque
// crear un usuario de Auth para otra persona requiere la service_role key, que
// nunca puede vivir en el navegador. SUPABASE_URL, SUPABASE_ANON_KEY y
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
      return jsonResponse({ error: 'Solo un admin puede crear usuarios' }, 403);
    }

    const { email, full_name, password, role, days } = await req.json();
    if (!email || !full_name || !password || String(password).length < 6) {
      return jsonResponse({ error: 'Faltan datos: email, nombre y contraseña (mínimo 6 caracteres)' }, 400);
    }
    if (role !== 'admin' && role !== 'alumno') {
      return jsonResponse({ error: 'Rol inválido' }, 400);
    }
    if (role === 'alumno' && (!days || Number(days) <= 0)) {
      return jsonResponse({ error: 'Faltan los días de acceso (mayor a 0)' }, 400);
    }

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      return jsonResponse({ error: createError?.message ?? 'No se pudo crear el usuario' }, 400);
    }

    const profileInsert: Record<string, unknown> = {
      id: created.user.id,
      full_name,
      role,
      subscription_status: 'active',
    };
    if (role === 'alumno') {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(days));
      profileInsert.subscription_expires_at = expiresAt.toISOString().slice(0, 10);
    }

    const { error: profileError } = await adminClient.from('profiles').insert(profileInsert);
    if (profileError) {
      // sin perfil el usuario queda inservible (y useRole lo recrearía como
      // alumno por default) — mejor no dejar un auth.users huérfano.
      await adminClient.auth.admin.deleteUser(created.user.id);
      return jsonResponse({ error: profileError.message }, 400);
    }

    return jsonResponse({ ok: true, userId: created.user.id }, 200);
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});
