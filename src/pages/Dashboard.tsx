import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileX, 
  User, 
  Calendar, 
  TrendingUp, 
  Activity,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Brain,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalUpload } from "@/components/MedicalUpload";
import medicalHero from "@/assets/medical-hero.jpg";

const Dashboard = () => {
  const [isDragOver, setIsDragOver] = useState(false);

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
    // Handle file upload here
    console.log("Files dropped:", e.dataTransfer.files);
  };

  const recentScans = [
    { id: 1, date: "2024-01-15", type: "Chest X-Ray", status: "completed", confidence: 94 },
    { id: 2, date: "2024-01-14", type: "Knee X-Ray", status: "processing", confidence: null },
    { id: 3, date: "2024-01-12", type: "Hand X-Ray", status: "completed", confidence: 87 },
  ];

  const stats = [
    { label: "Total Scans", value: "127", icon: FileX, trend: "+12%" },
    { label: "This Month", value: "23", icon: Calendar, trend: "+8%" },
    { label: "Accuracy Rate", value: "94.2%", icon: TrendingUp, trend: "+2.1%" },
    { label: "Processing Time", value: "1.2s", icon: Clock, trend: "-0.3s" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">MediScan AI</h1>
                <p className="text-sm text-muted-foreground">Advanced X-Ray Analysis</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/reports" className="text-muted-foreground hover:text-primary transition-colors">
                Reports
              </Link>
              <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                Profile
              </Link>
              <Button variant="outline_medical" size="sm" asChild>
                <Link to="/login">Account</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Dr. Johnson
          </h2>
          <p className="text-muted-foreground">
            Upload X-rays for instant AI-powered analysis and diagnosis
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-success mt-1">{stat.trend}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CNN Model Integration Section */}
        <div className="mb-8">
          <MedicalUpload />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  CNN Model Performance
                </CardTitle>
                <CardDescription>
                  DenseNet121 architecture with multi-label classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
                    <Shield className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-success">No Finding</p>
                      <p className="text-sm text-muted-foreground">Primary Class</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-warning/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium text-warning">Pneumonia</p>
                      <p className="text-sm text-muted-foreground">Critical Detection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-primary">Other Diseases</p>
                      <p className="text-sm text-muted-foreground">Multi-class</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-card/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Model Specifications</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Architecture:</span>
                      <span className="ml-2 font-medium">DenseNet121</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Loss Function:</span>
                      <span className="ml-2 font-medium">Focal Loss (γ=2.0)</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Input Size:</span>
                      <span className="ml-2 font-medium">224×224 pixels</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Format:</span>
                      <span className="ml-2 font-medium">DICOM, JPEG, PNG</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Scans */}
          <div>
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Scans
                </CardTitle>
                <CardDescription>Your latest X-ray analyses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{scan.type}</p>
                      <p className="text-sm text-muted-foreground">{scan.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {scan.status === "completed" ? (
                        <>
                          <Badge variant="secondary" className="text-success">
                            {scan.confidence}% confidence
                          </Badge>
                          <CheckCircle className="h-4 w-4 text-success" />
                        </>
                      ) : (
                        <>
                          <Badge variant="secondary">Processing</Badge>
                          <Clock className="h-4 w-4 text-warning animate-spin" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/reports">View All Reports</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="mt-12">
          <Card className="bg-gradient-card border-0 shadow-strong overflow-hidden">
            <div className="relative h-64 lg:h-80">
              <img 
                src={medicalHero} 
                alt="Medical AI Analysis" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
                <div className="p-8 text-primary-foreground max-w-2xl">
                  <h3 className="text-3xl font-bold mb-4">
                    Advanced AI-Powered Medical Imaging
                  </h3>
                  <p className="text-lg mb-6 opacity-90">
                    Our cutting-edge CNN model analyzes X-rays with 94% accuracy, helping healthcare professionals make faster, more accurate diagnoses.
                  </p>
                  <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;