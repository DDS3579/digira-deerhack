import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, MapPin, Clock, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function SendRequest() {
  const navigate = useNavigate();
  const { latitude, longitude, error: geoError, loading: geoLoading, getLocation } = useGeolocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to create invitation
    const formData = new FormData(e.target);
    const invitationData = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      time: formData.get("time"),
      location: formData.get("location"),
      invitees: formData.get("invitees"),
      latitude: latitude || null,
      longitude: longitude || null,
    };
    
    console.log("Invitation data:", invitationData);
    // After successful creation, navigate back to invitations page
    // navigate("/user/invitation");
    alert("Invitation sent successfully! (API integration pending)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send Invitation</h1>
        <p className="text-muted-foreground">
          Create and send an invitation to community members
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitation Details</CardTitle>
          <CardDescription>
            Fill in the information for your invitation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Event/Invitation Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter invitation title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the event or invitation..."
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                />
              </div>
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
                  placeholder="Enter event location"
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
              <Label htmlFor="invitees" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Invitees (Optional)
              </Label>
              <Input
                id="invitees"
                name="invitees"
                placeholder="Enter names or emails (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to invite all community members
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Send Invitation</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/user/invitation")}
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

