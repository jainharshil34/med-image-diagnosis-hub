import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!
    supabaseClient.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    })

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const url = new URL(req.url)
    const xrayImageId = url.searchParams.get('xrayImageId')

    if (xrayImageId) {
      // Get specific prediction
      const { data: prediction, error } = await supabaseClient
        .from('model_predictions')
        .select(`
          *,
          xray_images!inner(
            id,
            file_name,
            status,
            uploaded_at,
            user_id
          )
        `)
        .eq('xray_image_id', xrayImageId)
        .eq('xray_images.user_id', user.id)
        .single()

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: prediction
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      // Get all predictions for user
      const { data: predictions, error } = await supabaseClient
        .from('model_predictions')
        .select(`
          *,
          xray_images!inner(
            id,
            file_name,
            status,
            uploaded_at,
            user_id
          )
        `)
        .eq('xray_images.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: predictions
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

  } catch (error) {
    console.error('Get predictions error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})