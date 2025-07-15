import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  predictionId: string
  format: 'pdf' | 'json'
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

    const authHeader = req.headers.get('Authorization')!
    supabaseClient.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    })

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const { predictionId, format = 'json' }: ReportRequest = await req.json()

    // Get prediction with related data
    const { data: prediction, error } = await supabaseClient
      .from('model_predictions')
      .select(`
        *,
        xray_images!inner(
          id,
          file_name,
          file_size,
          uploaded_at,
          user_id
        )
      `)
      .eq('id', predictionId)
      .eq('xray_images.user_id', user.id)
      .single()

    if (error) {
      throw error
    }

    // Generate comprehensive report
    const report = {
      reportId: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      patientInfo: {
        userId: user.id,
        email: user.email
      },
      imageInfo: {
        fileName: prediction.xray_images.file_name,
        fileSize: prediction.xray_images.file_size,
        uploadedAt: prediction.xray_images.uploaded_at
      },
      analysis: {
        modelVersion: prediction.model_version,
        processingTime: `${prediction.processing_time_ms}ms`,
        accuracy: `${prediction.model_accuracy}%`,
        
        predictions: [
          {
            condition: "No Finding",
            confidence: `${prediction.no_finding_confidence}%`,
            status: prediction.no_finding_confidence > 50 ? "Primary" : "Secondary"
          },
          {
            condition: "Pneumonia", 
            confidence: `${prediction.pneumonia_confidence}%`,
            status: prediction.pneumonia_confidence > 50 ? "Primary" : "Secondary"
          },
          {
            condition: "Other Diseases",
            confidence: `${prediction.other_diseases_confidence}%`, 
            status: prediction.other_diseases_confidence > 50 ? "Primary" : "Secondary"
          }
        ],
        
        primaryDiagnosis: {
          condition: prediction.primary_diagnosis,
          confidence: `${prediction.primary_confidence}%`,
          severity: prediction.severity,
          recommendation: getPrimaryRecommendation(prediction.primary_diagnosis, prediction.severity)
        }
      },
      
      technicalDetails: {
        architecture: "DenseNet121 with GlobalAveragePooling2D",
        lossFunction: "Weighted Sigmoid Focal Loss (γ=2.0)",
        inputSize: "224×224 pixels (3-channel)",
        preprocessing: "DICOM VOI LUT + normalization + ImageNet preprocessing",
        classWeights: "Balanced for class imbalance",
        validationMetrics: {
          accuracy: "94.0%",
          auc: "0.92",
          precision: "0.89",
          recall: "0.91"
        }
      },
      
      disclaimer: "This analysis is for research and educational purposes only. Always consult with qualified medical professionals for clinical diagnosis and treatment decisions.",
      
      xaiExplanation: {
        method: "Grad-CAM + LIME",
        heatmapAvailable: !!prediction.heatmap_path,
        description: "Explainable AI techniques highlight the image regions that most influenced the model's prediction, providing transparency in the diagnostic process."
      }
    }

    function getPrimaryRecommendation(diagnosis: string, severity: string): string {
      if (diagnosis === "No Finding") {
        return "No significant abnormalities detected. Regular follow-up as recommended by healthcare provider."
      } else if (diagnosis === "Pneumonia") {
        if (severity === "high") {
          return "High confidence pneumonia detection. Immediate medical attention recommended."
        } else if (severity === "medium") {
          return "Moderate confidence pneumonia detection. Clinical correlation and medical evaluation advised."
        } else {
          return "Low confidence pneumonia detection. Additional imaging or clinical assessment may be needed."
        }
      } else {
        return "Other pathological findings detected. Further medical evaluation and specialist consultation recommended."
      }
    }

    // Store report in database
    const { data: reportData, error: reportError } = await supabaseClient
      .from('analysis_reports')
      .insert({
        xray_image_id: prediction.xray_image_id,
        prediction_id: predictionId,
        user_id: user.id,
        report_data: report
      })
      .select()
      .single()

    if (reportError) {
      throw reportError
    }

    if (format === 'pdf') {
      // In production, you would generate a PDF here
      // For now, return the JSON structure
      return new Response(
        JSON.stringify({
          success: true,
          message: "PDF generation not implemented yet. Returning JSON format.",
          data: {
            reportId: reportData.id,
            format: 'json',
            report
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          reportId: reportData.id,
          format,
          report
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Generate report error:', error)
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