
import React, { useState, useEffect } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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

const TruckInspectionForm = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [images, setImages] = useState<TruckImages>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({
            title: "Location accessed",
            description: "Successfully retrieved your current location.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Please enable location access to continue.",
            variant: "destructive",
          });
        }
      );
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Truck Inspection Form</h2>
        
        {/* Personal Information */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Location</h3>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-3">
            <MapPin className="text-blue-500" />
            {location ? (
              <span>
                Location captured: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </span>
            ) : (
              <span>Accessing location...</span>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Truck Images</h3>
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
                  className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer"
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

        <Button className="w-full mt-8">
          Submit Inspection
        </Button>
      </Card>
    </div>
  );
};

export default TruckInspectionForm;
