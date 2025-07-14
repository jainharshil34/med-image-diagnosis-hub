import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Settings,
  Camera,
  Award,
  Activity,
  Clock,
  FileText,
  Stethoscope,
  Edit3
} from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hospital.com",
    phone: "+1 (555) 123-4567",
    specialty: "Radiology",
    hospital: "City General Hospital",
    license: "MD-123456789",
    experience: "12 years"
  });

  const profileStats = [
    { label: "Total Scans", value: "1,247", icon: FileText },
    { label: "Accuracy Rate", value: "96.8%", icon: Award },
    { label: "Experience", value: "12 Years", icon: Clock },
    { label: "Specialty", value: "Radiology", icon: Activity },
  ];

  const recentActivity = [
    { date: "2024-01-15", action: "Analyzed chest X-ray", result: "Normal findings" },
    { date: "2024-01-15", action: "Reviewed knee X-ray", result: "Mild arthritis detected" },
    { date: "2024-01-14", action: "Completed hand X-ray", result: "Fracture identified" },
    { date: "2024-01-14", action: "Analyzed spine X-ray", result: "Slight curvature noted" },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile data
  };

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
              <Link to="/reports" className="text-muted-foreground hover:text-primary transition-colors">
                Reports
              </Link>
              <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
                Profile
              </Link>
              <Button variant="outline_medical" size="sm" asChild>
                <Link to="/login">Account</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src="/placeholder-doctor.jpg" alt="Profile" />
                    <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {profileData.firstName} {profileData.lastName}
                      </h2>
                      <p className="text-lg text-muted-foreground">{profileData.specialty}</p>
                      <p className="text-sm text-muted-foreground">{profileData.hospital}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-success">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                        <Badge variant="secondary">
                          License: {profileData.license}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button 
                      variant={isEditing ? "success" : "outline_medical"} 
                      onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                      className="whitespace-nowrap"
                    >
                      {isEditing ? (
                        <>Save Changes</>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {profileStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your personal and professional information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName"
                          value={profileData.firstName}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          value={profileData.lastName}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled={!isEditing}
                          className="pl-10"
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone"
                          value={profileData.phone}
                          disabled={!isEditing}
                          className="pl-10"
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="professional" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Medical Specialty</Label>
                        <Input 
                          id="specialty"
                          value={profileData.specialty}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input 
                          id="experience"
                          value={profileData.experience}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital/Institution</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="hospital"
                          value={profileData.hospital}
                          disabled={!isEditing}
                          className="pl-10"
                          onChange={(e) => setProfileData({...profileData, hospital: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="license">Medical License</Label>
                      <Input 
                        id="license"
                        value={profileData.license}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, license: e.target.value})}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.result}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {activity.date}
                      </p>
                    </div>
                    {index < recentActivity.length - 1 && <Separator />}
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full History
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-gradient-card border-0 shadow-soft mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Separator />
                <Button variant="destructive" size="sm" className="w-full">
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;