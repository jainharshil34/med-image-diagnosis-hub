import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { 
  Stethoscope, 
  Brain, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Upload,
  Activity,
  Award,
  Users,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import medicalHero from "@/assets/medical-hero.jpg";

const Index = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced CNN models trained on millions of X-ray images for accurate disease detection",
      stats: "94% accuracy",
      details: {
        fullDescription: "Our state-of-the-art Convolutional Neural Network (CNN) has been trained on over 10 million X-ray images from leading medical institutions worldwide. The model uses advanced deep learning techniques including transfer learning and ensemble methods to achieve industry-leading accuracy.",
        benefits: ["Detects subtle abnormalities invisible to human eye", "Reduces diagnostic errors by 75%", "Supports radiologists in making confident decisions", "Continuously learning from new data"],
        techSpecs: "ResNet-152 architecture with 50+ layers, trained on diverse global datasets"
      }
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive analysis reports in under 2 seconds with confidence scores",
      stats: "< 2s processing",
      details: {
        fullDescription: "Lightning-fast processing powered by optimized GPU clusters and edge computing infrastructure. Get immediate results without compromising accuracy, enabling real-time decision making in critical care scenarios.",
        benefits: ["Real-time analysis for emergency cases", "Reduces patient wait times significantly", "Enables faster treatment decisions", "Optimized for high-volume clinics"],
        techSpecs: "NVIDIA A100 GPU clusters with 99.9% uptime SLA"
      }
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Bank-grade security ensuring patient data privacy and regulatory compliance",
      stats: "100% secure",
      details: {
        fullDescription: "Complete HIPAA compliance with end-to-end encryption, secure data transmission, and comprehensive audit trails. All patient data is protected with military-grade security protocols and stored in SOC 2 certified data centers.",
        benefits: ["Zero-trust security architecture", "End-to-end encryption in transit and at rest", "Regular security audits and penetration testing", "Complete data anonymization options"],
        techSpecs: "AES-256 encryption, SOC 2 Type II certified, GDPR compliant"
      }
    },
    {
      icon: Activity,
      title: "Multi-Modal Detection",
      description: "Detect fractures, pneumonia, tumors, and 50+ other conditions across body systems",
      stats: "50+ conditions",
      details: {
        fullDescription: "Comprehensive diagnostic capabilities across multiple body systems and pathologies. From common conditions like pneumonia and fractures to rare diseases, our AI provides detailed analysis with specific confidence scores for each finding.",
        benefits: ["Covers chest, skeletal, and abdominal imaging", "Detects both common and rare conditions", "Provides differential diagnosis suggestions", "Supports multiple imaging modalities"],
        techSpecs: "Multi-class classification with 97% sensitivity and 95% specificity"
      }
    },
    {
      icon: CheckCircle,
      title: "Explainable AI (XAI)",
      description: "Visual explanations and heatmaps showing exactly where the AI detected abnormalities for complete transparency",
      stats: "100% transparent",
      details: {
        fullDescription: "Revolutionary explainable AI technology that provides visual evidence for every diagnosis. See exactly where and why the AI detected abnormalities through advanced heatmaps, attention visualization, and detailed reasoning pathways.",
        benefits: ["Visual heatmaps highlight areas of concern", "Confidence scores for each finding", "Decision pathway transparency", "Supports medical education and training"],
        techSpecs: "Grad-CAM visualization with LIME explanations and SHAP values"
      }
    }
  ];

  const stats = [
    { value: "1M+", label: "X-rays Analyzed", icon: Upload },
    { value: "500+", label: "Healthcare Partners", icon: Users },
    { value: "94%", label: "Diagnostic Accuracy", icon: Award },
    { value: "1.2s", label: "Average Processing", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MediScan AI</h1>
                <p className="text-xs text-muted-foreground">Advanced X-Ray Analysis</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="#stats" className="text-muted-foreground hover:text-primary transition-colors">
                Statistics
              </Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Button variant="outline_medical" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="medical" size="sm" asChild>
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  ✨ AI-Powered Medical Imaging
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                  Revolutionizing
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> X-Ray </span>
                  Diagnosis
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Our advanced CNN model analyzes X-ray images with 94% accuracy, helping healthcare 
                  professionals make faster, more accurate diagnoses and improve patient outcomes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="medical" size="xl" asChild className="group">
                  <Link to="/dashboard">
                    Start Analysis
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline_medical" size="xl" asChild>
                  <Link to="/login">View Demo</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">FDA Cleared</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-strong">
                <img 
                  src={medicalHero} 
                  alt="AI Medical Analysis"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-lg p-4 shadow-strong border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">94% Accuracy</p>
                    <p className="text-sm text-muted-foreground">Clinically Validated</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-card rounded-lg p-4 shadow-strong border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">1.2s</p>
                    <p className="text-sm text-muted-foreground">Processing Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Healthcare Professionals Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform has processed millions of X-rays, helping doctors make better decisions faster
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-primary rounded-full shadow-glow">
                    <stat.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Advanced AI Technology for Medical Imaging
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leverage cutting-edge machine learning models to enhance diagnostic accuracy and workflow efficiency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedFeature(feature)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full group-hover:bg-gradient-primary group-hover:shadow-glow transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {feature.stats}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals using MediScan AI to improve patient care and diagnostic accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
              <Link to="/dashboard">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
              <Link to="/login">Request Demo</Link>
            </Button>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">MediScan AI</h3>
                <p className="text-sm text-muted-foreground">Advanced X-Ray Analysis Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 MediScan AI. All rights reserved.</span>
              <span>•</span>
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>FDA Cleared</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Feature Details Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl bg-card border shadow-strong z-50">
          {selectedFeature && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-primary rounded-full shadow-glow">
                    <selectedFeature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {selectedFeature.title}
                    </DialogTitle>
                    <Badge variant="secondary" className="mt-1">
                      {selectedFeature.stats}
                    </Badge>
                  </div>
                </div>
                <DialogDescription className="text-lg text-muted-foreground leading-relaxed">
                  {selectedFeature.details.fullDescription}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {selectedFeature.details.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Technical Specifications</h4>
                  <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg border">
                    {selectedFeature.details.techSpecs}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button variant="medical" size="lg" asChild>
                    <Link to="/dashboard">Try This Feature</Link>
                  </Button>
                  <Button variant="outline_medical" size="lg" asChild>
                    <Link to="/login">Learn More</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
