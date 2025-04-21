
import React, { useState } from 'react';
import { Camera, MapPin, Truck, AlertTriangle, User } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Location {
  latitude: number;
  longitude: number;
}

interface TruckImages {
  front?: File;
  back?: File;
  left?: File;
  right?: File;
}

// New interface for props to accept client info
interface TruckAssistanceFormProps {
  cli_email?: string;
  cli_name?: string;
  cli_phone?: string;
}

const TruckAssistanceForm: React.FC<TruckAssistanceFormProps> = ({
  cli_email = '',
  cli_name = '',
  cli_phone = ''
}) => {
  // If a prop is present, initialize state with it, otherwise empty string
  const [location, setLocation] = useState<Location | null>(null);
  const [images, setImages] = useState<TruckImages>({});
  const [name, setName] = useState(cli_name);
  const [email, setEmail] = useState(cli_email);
  const [phone, setPhone] = useState(cli_phone);
  const [truckIssue, setTruckIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({
            title: "Location accessed",
            description: "Successfully retrieved your location. Help can be sent to your coordinates.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Please enable location access to receive assistance at your location.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleImageUpload = (view: keyof TruckImages) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImages((prev) => ({
        ...prev,
        [view]: e.target.files![0],
      }));
      toast({
        title: "Image uploaded",
        description: `${view.charAt(0).toUpperCase() + view.slice(1)} view image added successfully.`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Help request sent",
        description: "Your truck assistance request has been received. Help is on the way!",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800">Truck Assistance Request</h2>
        </div>

        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Need immediate help?</AlertTitle>
          <AlertDescription className="text-amber-700">
            Fill out this form to request assistance for your truck. We'll dispatch help to your location as soon as possible.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Contact Information
            </h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Driver/Contact Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  readOnly={!!cli_name}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  readOnly={!!cli_email}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (for immediate contact)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                  readOnly={!!cli_phone}
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-red-500" />
              Your Location
            </h3>
            <div className="space-y-4">
              <Button 
                type="button"
                onClick={handleGetLocation}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <MapPin className="h-4 w-4" />
                Get My Location
              </Button>
              {location && (
                <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-3">
                  <MapPin className="text-red-500" />
                  <span>
                    Location captured: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Truck Issue */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Truck Issue
            </h3>
            <Label htmlFor="truckIssue">Describe your truck issue</Label>
            <textarea
              id="truckIssue"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={truckIssue}
              onChange={(e) => setTruckIssue(e.target.value)}
              placeholder="Please describe what's wrong with your truck (e.g., flat tire, engine trouble, etc.)"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-500" />
              Truck Images (optional)
            </h3>
            <p className="text-sm text-gray-600">Upload images of your truck to help our team better understand the situation</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['front', 'back', 'left', 'right'] as const).map((view) => (
                <div key={view} className="relative">
                  <input
                    type="file"
                    id={`${view}-view`}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload(view)}
                  />
                  <Label
                    htmlFor={`${view}-view`}
                    className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition duration-200"
                  >
                    {images[view] ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(images[view]!)}
                          alt={`${view} view`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 capitalize">{view} View</span>
                      </div>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Request..." : "Request Assistance Now"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default TruckAssistanceForm;
