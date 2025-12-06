import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, MapPin, MessageSquare, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function AddProblem() {
  const navigate = useNavigate();
  const { latitude, longitude, error: geoError, loading: geoLoading, getLocation } = useGeolocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to create complaint
    const formData = new FormData(e.target);
    const complaintData = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
    };
    
    console.log("Complaint data:", complaintData);
    // After successful creation, navigate back to dashboard
    // navigate("/user/dashboard");
    alert("Complaint submitted successfully! (API integration pending)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Problem</h1>
        <p className="text-muted-foreground">
          Report a problem or complaint to the ward administration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Details</CardTitle>
          <CardDescription>
            Provide information about the problem you're reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Problem Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a brief title for the problem"
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
                placeholder="Describe the problem in detail..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter the location or address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Location Coordinates</Label>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getLocation}
                  disabled={geoLoading}
                  className="w-full"
                >
                  {geoLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Get My Location
                    </>
                  )}
                </Button>
                {geoError && (
                  <p className="text-sm text-destructive">{geoError}</p>
                )}
                {latitude && longitude && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        value={latitude}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        value={longitude}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Click the button above to automatically get your current location coordinates
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Submit Problem</Button>
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

