import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Download,
  Share2,
  Info
} from "lucide-react";

interface PredictionResult {
  condition: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  color: string;
}

interface XAIAnalysisProps {
  isAnalyzing?: boolean;
  results?: PredictionResult[];
  heatmapUrl?: string;
  onRetry?: () => void;
}

export const XAIAnalysis = ({ 
  isAnalyzing = false, 
  results = [], 
  heatmapUrl,
  onRetry 
}: XAIAnalysisProps) => {
  const [selectedResult, setSelectedResult] = useState<PredictionResult | null>(null);

  const displayResults = results;
  const maxConfidence = Math.max(...displayResults.map(r => r.confidence));
  const primaryDiagnosis = displayResults.find(r => r.confidence === maxConfidence);

  if (isAnalyzing) {
    return (
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <CardTitle className="text-2xl">Analyzing X-Ray</CardTitle>
          <CardDescription>
            Our CNN model is processing your medical image...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Processing with DenseNet121</span>
              <span>90% accuracy</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              Estimated completion: 2 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Diagnosis Alert */}
      {primaryDiagnosis && (
        <Alert className={`border-l-4 ${
          primaryDiagnosis.condition === "No finding" 
            ? "border-l-success bg-success/5" 
            : primaryDiagnosis.condition === "Pneumonia"
            ? "border-l-warning bg-warning/5"
            : "border-l-destructive bg-destructive/5"
        }`}>
          <Brain className="h-4 w-4" />
          <AlertDescription className="font-medium">
            <span className="font-semibold">Primary Diagnosis:</span> {primaryDiagnosis.condition} 
            <span className={`ml-2 font-bold ${primaryDiagnosis.color}`}>
              ({primaryDiagnosis.confidence.toFixed(1)}% confidence)
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Prediction Results */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            CNN Model Predictions
          </CardTitle>
          <CardDescription>
            Multi-label classification results from DenseNet121 architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayResults.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border hover:bg-card/80 transition-colors cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    result.condition === "No finding" ? "bg-success/10" :
                    result.condition === "Pneumonia" ? "bg-warning/10" : "bg-muted/10"
                  }`}>
                    {result.condition === "No finding" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : result.condition === "Pneumonia" ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : (
                      <Info className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{result.condition}</p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {result.confidence.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Progress value={result.confidence} className="w-24 h-2 mb-1" />
                  <Badge variant={
                    result.confidence > 80 ? "default" :
                    result.confidence > 50 ? "secondary" : "outline"
                  }>
                    {result.confidence.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* XAI Heatmap Visualization */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Explainable AI Heatmap
          </CardTitle>
          <CardDescription>
            Visual explanation showing areas of focus for the AI decision
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-muted/20 p-4">
              {heatmapUrl ? (
                <img 
                  src={heatmapUrl} 
                  alt="XAI Heatmap showing AI attention areas" 
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-48 bg-muted/20 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Eye className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Grad-CAM Unavailable</p>
                    <p className="text-xs">Heatmap will appear when analysis completes</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Re-analyze
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Model Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Architecture</h4>
              <p className="text-muted-foreground">DenseNet121 with GlobalAveragePooling2D</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Loss Function</h4>
              <p className="text-muted-foreground">Weighted Sigmoid Focal Loss (γ=2.0)</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Input Size</h4>
              <p className="text-muted-foreground">224×224 pixels (3-channel)</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Classes</h4>
              <p className="text-muted-foreground">Multi-label: No finding, Pneumonia, Other disease</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};