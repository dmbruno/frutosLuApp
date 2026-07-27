// Edge Function: borra a un alumno para siempre (solo si está inactivo).
// Borra el usuario de Auth con la Admin API (requiere service_role, por eso
// corre en el servidor). profiles.id referencia a auth.users(id) on delete
// cascade, y todo lo demás (workout_sessions, programs, body_metrics,
// progress_photos, student_notes) referencia a profiles(id) on delete cascade
// también — así que borrar el usuario de Auth alcanza para limpiar todo.
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

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: callerProfile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single();

    if (callerProfile?.role !== 'admin') {
      return jsonResponse({ error: 'Solo un admin puede eliminar alumnos' }, 403);
    }

    const { userId } = await req.json();
    if (!userId) {
      return jsonResponse({ error: 'Falta userId' }, 400);
    }

    const { data: target, error: targetError } = await adminClient
      .from('profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single();
    if (targetError || !target) {
      return jsonResponse({ error: 'Alumno no encontrado' }, 404);
    }
    if (target.subscription_status === 'active') {
      return jsonResponse(
        { error: 'No se puede eliminar un alumno con suscripción activa. Desactivalo primero.' },
        400,
      );
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteError) {
      return jsonResponse({ error: deleteError.message }, 400);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});
