import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'
import { cookies } from "next/headers";

// Create Supabase client for server-side
async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.delete(name);
        },
      },
    }
  );
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user's businesses
    const { data: negocios, error } = await supabase
      .from('negocios')
      .select(`
        id_negocio,
        id_usuario,
        nombre,
        estado,
        fecha_creacion,
        fecha_activacion,
        url_tienda,
        created_at,
        updated_at
      `)
      .eq('id_usuario', user.id)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('Error fetching businesses:', error);
      return NextResponse.json(
        { error: "Error al obtener negocios" },
        { status: 500 }
      );
    }

    return NextResponse.json({ negocios: negocios || [] });

  } catch (error) {
    console.error('Unexpected error in GET /api/negocios:', error);
    return NextResponse.json(
      { error: "Error inesperado del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nombre } = body;

    if (!nombre || nombre.trim() === '') {
      return NextResponse.json(
        { error: "El nombre del negocio es requerido" },
        { status: 400 }
      );
    }

    // Create new business
    const { data: negocio, error } = await supabase
      .from('negocios')
      .insert({
        id_usuario: user.id,
        nombre: nombre.trim(),
        estado: 'en_configuracion'
      })
      .select(`
        id_negocio,
        id_usuario,
        nombre,
        estado,
        fecha_creacion,
        fecha_activacion,
        url_tienda,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error('Error creating business:', error);
      return NextResponse.json(
        { error: "Error al crear negocio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ negocio }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/negocios:', error);
    return NextResponse.json(
      { error: "Error inesperado del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id_negocio = searchParams.get('id');

    if (!id_negocio) {
      return NextResponse.json(
        { error: "ID del negocio es requerido" },
        { status: 400 }
      );
    }

    // Verify ownership and delete business
    const { error } = await supabase
      .from('negocios')
      .delete()
      .eq('id_negocio', id_negocio)
      .eq('id_usuario', user.id);

    if (error) {
      console.error('Error deleting business:', error);
      return NextResponse.json(
        { error: "Error al eliminar negocio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/negocios:', error);
    return NextResponse.json(
      { error: "Error inesperado del servidor" },
      { status: 500 }
    );
  }
}