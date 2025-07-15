import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  xrayImageId: string
  storagePath: string
}

interface ModelPrediction {
  noFindingConfidence: number
  pneumoniaConfidence: number
  otherDiseaseConfidence: number
  primaryDiagnosis: string
  primaryConfidence: number
  severity: 'low' | 'medium' | 'high'
  processingTimeMs: number
}

// Call your actual Python CNN model server
async function runCNNModel(imageBuffer: ArrayBuffer): Promise<ModelPrediction> {
  const startTime = Date.now()
  
  try {
    // Create form data with the image
    const formData = new FormData()
    formData.append('image', new Blob([imageBuffer]))
    
    // Call your Python model server
    const MODEL_SERVER_URL = Deno.env.get('MODEL_SERVER_URL') || 'http://localhost:5000'
    
    const response = await fetch(`${MODEL_SERVER_URL}/predict`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`Model server error: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Model prediction failed')
    }
    
    return {
      noFindingConfidence: result.predictions.no_finding_confidence,
      pneumoniaConfidence: result.predictions.pneumonia_confidence,
      otherDiseaseConfidence: result.predictions.other_disease_confidence,
      primaryDiagnosis: result.primary_diagnosis,
      primaryConfidence: result.primary_confidence,
      severity: result.severity,
      processingTimeMs: Date.now() - startTime,
      heatmapBase64: result.heatmap_base64
    }
    
  } catch (error) {
    console.error('CNN Model Error:', error)
    throw new Error(`Model inference failed: ${error.message}`)
  }
}

// Generate XAI heatmap (mock implementation)
async function generateXAIHeatmap(imageBuffer: ArrayBuffer, prediction: ModelPrediction): Promise<string | null> {
  // In production, this would:
  // 1. Apply Grad-CAM or LIME to generate attention heatmap
  // 2. Overlay on original image
  // 3. Save to storage and return path
  
  // For now, return null (will be handled by frontend)
  return null
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role for full access
    )

    const { xrayImageId, storagePath }: AnalysisRequest = await req.json()

    // Update status to analyzing
    await supabaseClient
      .from('xray_images')
      .update({ 
        status: 'analyzing',
        processed_at: new Date().toISOString()
      })
      .eq('id', xrayImageId)

    // Download image from storage
    const { data: imageData, error: downloadError } = await supabaseClient.storage
      .from('medical-images')
      .download(storagePath)

    if (downloadError) {
      throw downloadError
    }

    const imageBuffer = await imageData.arrayBuffer()

    // Run CNN model prediction
    const prediction = await runCNNModel(imageBuffer)

    // Generate XAI heatmap
    const heatmapPath = await generateXAIHeatmap(imageBuffer, prediction)

    // Store prediction results
    const { data: predictionData, error: predictionError } = await supabaseClient
      .from('model_predictions')
      .insert({
        xray_image_id: xrayImageId,
        model_version: 'DenseNet121-v1.0',
        no_finding_confidence: prediction.noFindingConfidence,
        pneumonia_confidence: prediction.pneumoniaConfidence,
        other_diseases_confidence: prediction.otherDiseasesConfidence,
        primary_diagnosis: prediction.primaryDiagnosis,
        primary_confidence: prediction.primaryConfidence,
        severity: prediction.severity,
        heatmap_path: heatmapPath,
        processing_time_ms: prediction.processingTimeMs,
        explanation_data: {
          model_architecture: "DenseNet121 with GlobalAveragePooling2D",
          loss_function: "Weighted Sigmoid Focal Loss (γ=2.0)",
          input_size: "224×224 pixels (3-channel)",
          classes: ["No Finding", "Pneumonia", "Other Diseases"],
          confidence_threshold: 0.5,
          preprocessing: "DICOM VOI LUT + normalization + ImageNet preprocessing"
        }
      })
      .select()
      .single()

    if (predictionError) {
      throw predictionError
    }

    // Update X-ray status to completed
    await supabaseClient
      .from('xray_images')
      .update({ status: 'completed' })
      .eq('id', xrayImageId)

    // Generate analysis report
    const reportData = {
      xrayImageId,
      predictionId: predictionData.id,
      modelVersion: 'DenseNet121-v1.0',
      predictions: [
        {
          condition: 'No Finding',
          confidence: prediction.noFindingConfidence,
          severity: 'low'
        },
        {
          condition: 'Pneumonia',
          confidence: prediction.pneumoniaConfidence,
          severity: prediction.severity
        },
        {
          condition: 'Other Diseases',
          confidence: prediction.otherDiseasesConfidence,
          severity: prediction.severity
        }
      ],
      primaryDiagnosis: {
        condition: prediction.primaryDiagnosis,
        confidence: prediction.primaryConfidence,
        severity: prediction.severity
      },
      technicalDetails: {
        processingTime: prediction.processingTimeMs,
        modelAccuracy: 94.0,
        architecture: "DenseNet121",
        inputSize: "224×224",
        classes: 3
      },
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          predictionId: predictionData.id,
          prediction,
          reportData
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Analysis error:', error)
    
    // Update status to failed if we have the xrayImageId
    try {
      const { xrayImageId } = await req.json()
      if (xrayImageId) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )
        
        await supabaseClient
          .from('xray_images')
          .update({ status: 'failed' })
          .eq('id', xrayImageId)
      }
    } catch (e) {
      console.error('Failed to update status:', e)
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})