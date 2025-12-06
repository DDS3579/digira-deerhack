import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle, Phone, MapPin, MessageSquare, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function AskHelp() {
  const navigate = useNavigate();
  const { latitude, longitude, error: geoError, loading: geoLoading, getLocation } = useGeolocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to create help request
    const formData = new FormData(e.target);
    const helpData = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      contact: formData.get("contact"),
      urgency: formData.get("urgency"),
      latitude: latitude || null,
      longitude: longitude || null,
    };
    
    console.log("Help request data:", helpData);
    // After successful creation, navigate back to dashboard
    // navigate("/user/dashboard");
    alert("Help request submitted successfully! (API integration pending)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ask for Help</h1>
        <p className="text-muted-foreground">
          Request assistance from the community
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Help Request Details</CardTitle>
          <CardDescription>
            Provide information about the help you need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Request Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="What kind of help do you need?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your help request in detail..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  name="location"
                  placeholder="Where do you need help?"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getLocation}
                  disabled={geoLoading}
                  title="Get your current location"
                >
                  {geoLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {geoError && (
                <p className="text-sm text-destructive">{geoError}</p>
              )}
              {latitude && longitude && (
                <p className="text-xs text-muted-foreground">
                  Location captured: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </Label>
              <Input
                id="contact"
                name="contact"
                type="tel"
                placeholder="Your phone number or email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <select
                id="urgency"
                name="urgency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="low">Low - Can wait a few days</option>
                <option value="medium">Medium - Needed within a day</option>
                <option value="high">High - Urgent, needed soon</option>
                <option value="critical">Critical - Emergency</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Submit Help Request</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/user/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

