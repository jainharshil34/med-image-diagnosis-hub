-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create enum for diagnosis status
create type diagnosis_status as enum ('pending', 'analyzing', 'completed', 'failed');

-- Create enum for severity levels
create type severity_level as enum ('low', 'medium', 'high');

-- Create table for storing X-ray images and metadata
create table xray_images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  file_name text not null,
  file_size bigint not null,
  file_type text not null,
  storage_path text not null,
  uploaded_at timestamp with time zone default now(),
  processed_at timestamp with time zone,
  status diagnosis_status default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create table for model predictions
create table model_predictions (
  id uuid primary key default uuid_generate_v4(),
  xray_image_id uuid references xray_images(id) on delete cascade,
  model_version text not null default 'DenseNet121-v1.0',
  
  -- Multi-label predictions
  no_finding_confidence decimal(5,2) not null,
  pneumonia_confidence decimal(5,2) not null,
  other_diseases_confidence decimal(5,2) not null,
  
  -- Primary diagnosis (highest confidence)
  primary_diagnosis text not null,
  primary_confidence decimal(5,2) not null,
  severity severity_level not null,
  
  -- XAI data
  heatmap_path text,
  explanation_data jsonb,
  
  -- Model technical details
  processing_time_ms integer,
  model_accuracy decimal(5,2) default 94.0,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create table for analysis reports
create table analysis_reports (
  id uuid primary key default uuid_generate_v4(),
  xray_image_id uuid references xray_images(id) on delete cascade,
  prediction_id uuid references model_predictions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  
  report_data jsonb not null,
  generated_at timestamp with time zone default now(),
  downloaded_at timestamp with time zone,
  shared_with text[], -- email addresses
  
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_xray_images_user_id on xray_images(user_id);
create index idx_xray_images_status on xray_images(status);
create index idx_xray_images_created_at on xray_images(created_at desc);

create index idx_model_predictions_xray_id on model_predictions(xray_image_id);
create index idx_model_predictions_primary_diagnosis on model_predictions(primary_diagnosis);

create index idx_analysis_reports_user_id on analysis_reports(user_id);
create index idx_analysis_reports_generated_at on analysis_reports(generated_at desc);

-- Enable RLS
alter table xray_images enable row level security;
alter table model_predictions enable row level security;
alter table analysis_reports enable row level security;

-- RLS Policies for xray_images
create policy "Users can view their own X-ray images"
  on xray_images for select
  using (auth.uid() = user_id);

create policy "Users can insert their own X-ray images"
  on xray_images for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own X-ray images"
  on xray_images for update
  using (auth.uid() = user_id);

-- RLS Policies for model_predictions
create policy "Users can view predictions for their X-rays"
  on model_predictions for select
  using (
    exists (
      select 1 from xray_images 
      where xray_images.id = model_predictions.xray_image_id 
      and xray_images.user_id = auth.uid()
    )
  );

create policy "Service role can insert predictions"
  on model_predictions for insert
  with check (true);

create policy "Service role can update predictions"
  on model_predictions for update
  using (true);

-- RLS Policies for analysis_reports
create policy "Users can view their own reports"
  on analysis_reports for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reports"
  on analysis_reports for insert
  with check (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_xray_images_updated_at
  before update on xray_images
  for each row execute procedure update_updated_at_column();

create trigger update_model_predictions_updated_at
  before update on model_predictions
  for each row execute procedure update_updated_at_column();