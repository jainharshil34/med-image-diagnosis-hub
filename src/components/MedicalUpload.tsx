import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileImage, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Brain,
  Zap,
  Shield
} from "lucide-react";
import { XAIAnalysis } from "./XAIAnalysis";
import { uploadXRayImage, subscribeToXRayStatus, getPredictions } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id?: string;
  file: File;
  preview: string;
  status: "uploading" | "analyzing" | "completed" | "error";
  progress: number;
}

export const MedicalUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedFormats = [".dcm", ".dicom", ".jpg", ".jpeg", ".png"];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const isValidFormat = acceptedFormats.some(format => 
        file.name.toLowerCase().endsWith(format.toLowerCase())
      );
      const isValidSize = file.size <= maxFileSize;
      return isValidFormat && isValidSize;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: "uploading",
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload and processing
    newFiles.forEach((uploadedFile, index) => {
      simulateUpload(files.length + index);
    });
  };

  const simulateUpload = (fileIndex: number) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setFiles(prev => prev.map((file, idx) => {
        if (idx === fileIndex && file.status === "uploading") {
          const newProgress = Math.min(file.progress + 10, 100);
          return {
            ...file,
            progress: newProgress,
            status: newProgress === 100 ? "analyzing" : "uploading"
          };
        }
        return file;
      }));
    }, 200);

    // Complete upload after 2 seconds
    setTimeout(() => {
      clearInterval(uploadInterval);
      setFiles(prev => prev.map((file, idx) => 
        idx === fileIndex ? { ...file, status: "completed", progress: 100 } : file
      ));
    }, 2000);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const analyzeImages = async () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);

    try {
      // Upload the first completed file for analysis
      const fileToAnalyze = completedFiles[0];
      if (!fileToAnalyze) {
        throw new Error('No files to analyze');
      }

      // Upload and trigger analysis
      const uploadResult = await uploadXRayImage(fileToAnalyze.file);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      const xrayImageId = uploadResult.data.xrayImageId;

      // Subscribe to status updates
      const subscription = subscribeToXRayStatus(xrayImageId, async (payload) => {
        const status = payload.new.status;
        
        if (status === 'completed') {
          // Get the actual predictions
          const predictionsResult = await getPredictions(xrayImageId);
          
          if (predictionsResult.success && predictionsResult.data && predictionsResult.data.length > 0) {
            const prediction = predictionsResult.data[0];
            
            // Convert to expected format for XAIAnalysis component
            const results = [
              { 
                condition: "No finding", 
                confidence: prediction.no_finding_confidence, 
                severity: prediction.severity,
                color: "text-success" 
              },
              { 
                condition: "Pneumonia", 
                confidence: prediction.pneumonia_confidence, 
                severity: prediction.severity,
                color: "text-warning" 
              },
              { 
                condition: "Other disease", 
                confidence: prediction.other_diseases_confidence, 
                severity: prediction.severity,
                color: "text-muted-foreground" 
              }
            ];

            setAnalysisResults({
              predictions: results,
              heatmapUrl: prediction.heatmap_path,
              predictionId: prediction.id
            });
          }
          
          setIsAnalyzing(false);
          subscription.unsubscribe();
        } else if (status === 'failed') {
          throw new Error('Analysis failed');
        }
      });

      toast({
        title: "Analysis Started",
        description: "Your CNN model is processing the X-ray image...",
      });

    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      });
    }
  };

  const completedFiles = files.filter(f => f.status === "completed");

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            X-Ray Image Upload
          </CardTitle>
          <CardDescription>
            Upload DICOM files or X-ray images for AI-powered chest analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragOver 
                ? "border-primary bg-primary/5 scale-105" 
                : "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/2"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Drag & drop your X-ray images here
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse your files
            </p>
            
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <FileImage className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFormats.join(",")}
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">Supported formats: {acceptedFormats.join(", ")}</p>
              <p>Maximum file size: 50MB</p>
            </div>
          </div>

          {/* AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
              <Brain className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">CNN Analysis</p>
                <p className="text-xs text-muted-foreground">DenseNet121 model</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Fast Processing</p>
                <p className="text-xs text-muted-foreground">Results in ~2 seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">HIPAA Secure</p>
                <p className="text-xs text-muted-foreground">End-to-end encryption</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-card/50 border">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={file.preview} 
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    
                    {file.status !== "completed" && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize">{file.status}...</span>
                          <span>{file.progress}%</span>
                        </div>
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      file.status === "completed" ? "default" :
                      file.status === "error" ? "destructive" : "secondary"
                    }>
                      {file.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {file.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {file.status}
                    </Badge>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {completedFiles.length > 0 && (
              <div className="mt-6">
                <Button 
                  onClick={analyzeImages}
                  disabled={isAnalyzing}
                  className="w-full"
                  variant="medical"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Analyzing with CNN Model...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Images ({completedFiles.length})
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {(isAnalyzing || analysisResults) && (
        <XAIAnalysis 
          isAnalyzing={isAnalyzing}
          results={analysisResults?.predictions}
          onRetry={() => analyzeImages()}
        />
      )}

      {/* Integration Notice */}
      <Alert className="border-info bg-info/5">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Backend Integration Required:</strong> To fully integrate your CNN model, 
          connect to Supabase for model serving, DICOM processing, and secure data storage.
        </AlertDescription>
      </Alert>
    </div>
  );
};