import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Share2,
  Printer,
  Stethoscope,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const reports = [
    {
      id: "RPT-001",
      patientName: "John Smith",
      date: "2024-01-15",
      type: "Chest X-Ray",
      status: "completed",
      findings: "Normal lung fields, no acute cardiopulmonary abnormalities detected",
      confidence: 96,
      priority: "normal",
      technician: "Dr. Sarah Johnson"
    },
    {
      id: "RPT-002", 
      patientName: "Maria Garcia",
      date: "2024-01-15",
      type: "Knee X-Ray",
      status: "urgent",
      findings: "Mild degenerative joint disease, recommend orthopedic consultation",
      confidence: 89,
      priority: "high",
      technician: "Dr. Sarah Johnson"
    },
    {
      id: "RPT-003",
      patientName: "Robert Brown",
      date: "2024-01-14",
      type: "Hand X-Ray", 
      status: "completed",
      findings: "Healed fracture of 5th metacarpal, no complications",
      confidence: 94,
      priority: "normal",
      technician: "Dr. Sarah Johnson"
    },
    {
      id: "RPT-004",
      patientName: "Emily Davis",
      date: "2024-01-14",
      type: "Spine X-Ray",
      status: "review",
      findings: "Slight lumbar lordosis, within normal limits for patient age",
      confidence: 87,
      priority: "low",
      technician: "Dr. Sarah Johnson"
    },
    {
      id: "RPT-005",
      patientName: "Michael Wilson",
      date: "2024-01-13",
      type: "Chest X-Ray",
      status: "completed",
      findings: "Small opacity in right lower lobe, recommend CT follow-up",
      confidence: 92,
      priority: "high",
      technician: "Dr. Sarah Johnson"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "urgent": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "review": return <Clock className="h-4 w-4 text-warning" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case "urgent": return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Urgent</Badge>;
      case "review": return <Badge className="bg-warning/10 text-warning border-warning/20">Review</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-destructive";
      case "normal": return "border-l-primary";
      case "low": return "border-l-muted-foreground";
      default: return "border-l-border";
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.findings.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || report.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const statsData = [
    { label: "Total Reports", value: "127", change: "+12 this week", icon: FileText },
    { label: "Pending Review", value: "8", change: "2 urgent", icon: Clock },
    { label: "Avg Confidence", value: "94.2%", change: "+2.1% this month", icon: TrendingUp },
    { label: "Processing Time", value: "1.2s", change: "-0.3s improvement", icon: BarChart3 },
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
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/reports" className="text-foreground hover:text-primary transition-colors">
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
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Medical Reports</h2>
          <p className="text-muted-foreground">
            View, manage, and share your X-ray analysis reports
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-primary mt-1">{stat.change}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <Card className="bg-gradient-card border-0 shadow-medium mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports by patient, type, or findings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="urgent">Urgent</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className={`bg-gradient-card border-0 shadow-soft border-l-4 ${getPriorityColor(report.priority)} hover:shadow-medium transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {report.patientName}
                          </h3>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {report.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {report.date}
                          </span>
                          <span>ID: {report.id}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {report.findings}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Analyzed by: {report.technician}</span>
                        <Badge variant="secondary" className="text-primary">
                          {report.confidence}% confidence
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination would go here */}
        {filteredReports.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="medical" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;