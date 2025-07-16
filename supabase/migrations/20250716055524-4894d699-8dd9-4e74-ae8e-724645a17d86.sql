-- Create X-ray diagnosis schema
CREATE TABLE public.xray_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.xray_images ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own X-ray images" 
ON public.xray_images 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own X-ray images" 
ON public.xray_images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own X-ray images" 
ON public.xray_images 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create model predictions table
CREATE TABLE public.model_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  xray_image_id UUID NOT NULL REFERENCES public.xray_images(id) ON DELETE CASCADE,
  model_version TEXT NOT NULL DEFAULT 'DenseNet121-v1.0',
  no_finding_confidence DECIMAL(5,2) NOT NULL,
  pneumonia_confidence DECIMAL(5,2) NOT NULL,
  other_diseases_confidence DECIMAL(5,2) NOT NULL,
  primary_diagnosis TEXT NOT NULL,
  primary_confidence DECIMAL(5,2) NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  heatmap_path TEXT,
  explanation_data JSONB,
  processing_time_ms INTEGER,
  model_accuracy DECIMAL(5,2) DEFAULT 90.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.model_predictions ENABLE ROW LEVEL SECURITY;

-- Create policies for predictions
CREATE POLICY "Users can view predictions for their X-rays" 
ON public.model_predictions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.xray_images 
    WHERE xray_images.id = model_predictions.xray_image_id 
    AND xray_images.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert predictions" 
ON public.model_predictions 
FOR INSERT 
WITH CHECK (true);

-- Create storage bucket for medical images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-images', 'medical-images', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own X-ray images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medical-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own X-ray images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_xray_images_updated_at
  BEFORE UPDATE ON public.xray_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_model_predictions_updated_at
  BEFORE UPDATE ON public.model_predictions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();