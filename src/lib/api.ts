import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdaeulrdesncpzapmisv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkYWV1bHJkZXNuY3B6YXBtaXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjUyMjQsImV4cCI6MjA2ODE0MTIyNH0.0_LlnV_ZDg3mEf1D47-2JIy9mcK1pVb_TKHVdn5dxv0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface XRayImage {
  id: string
  user_id: string
  file_name: string
  file_size: number
  file_type: string
  storage_path: string
  uploaded_at: string
  processed_at?: string
  status: 'pending' | 'analyzing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface ModelPrediction {
  id: string
  xray_image_id: string
  model_version: string
  no_finding_confidence: number
  pneumonia_confidence: number
  other_diseases_confidence: number
  primary_diagnosis: string
  primary_confidence: number
  severity: 'low' | 'medium' | 'high'
  heatmap_path?: string
  explanation_data?: any
  processing_time_ms?: number
  model_accuracy?: number
  created_at: string
  updated_at: string
  xray_images?: XRayImage
}

export interface AnalysisReport {
  id: string
  xray_image_id: string
  prediction_id: string
  user_id: string
  report_data: any
  generated_at: string
  downloaded_at?: string
  shared_with?: string[]
  created_at: string
}

// Upload X-ray image
export async function uploadXRayImage(file: File): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${supabaseUrl}/functions/v1/upload-xray`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Get predictions for current user
export async function getPredictions(xrayImageId?: string): Promise<{ success: boolean; data?: ModelPrediction[]; error?: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    const url = new URL(`${supabaseUrl}/functions/v1/get-predictions`)
    if (xrayImageId) {
      url.searchParams.set('xrayImageId', xrayImageId)
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      }
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Get predictions error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get predictions'
    }
  }
}

// Generate analysis report
export async function generateReport(predictionId: string, format: 'pdf' | 'json' = 'json'): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/generate-report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ predictionId, format })
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Generate report error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report'
    }
  }
}

// Real-time subscription to X-ray status updates
export function subscribeToXRayStatus(xrayImageId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`xray-status-${xrayImageId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'xray_images',
        filter: `id=eq.${xrayImageId}`
      },
      callback
    )
    .subscribe()
}

// Real-time subscription to new predictions
export function subscribeToPredictions(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`predictions-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'model_predictions'
      },
      callback
    )
    .subscribe()
}