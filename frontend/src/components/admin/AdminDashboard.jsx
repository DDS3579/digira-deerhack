import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Newspaper, Calendar, MapPin, ArrowRight, Plus } from "lucide-react";
import { getComplaints, getSamachar, getEvents } from "@/services/api";
import { useGeolocation } from "@/hooks/useGeolocation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [samachar, setSamachar] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { latitude: userLat, longitude: userLng, getLocation } = useGeolocation();

  useEffect(() => {
    fetchDashboardData();
    // Request user location for map centering
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [complaintsData, samacharData, eventsData] = await Promise.all([
        getComplaints(3).catch(() => []),
        getSamachar(1).catch(() => []),
        getEvents().catch(() => [])
      ]);
      
      setComplaints(complaintsData || []);
      setSamachar(samacharData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique complaint locations for map
  const complaintLocations = complaints
    .filter(c => c.latitude && c.longitude)
    .map(c => ({ 
      lat: parseFloat(c.latitude), 
      lng: parseFloat(c.longitude),
      title: c.title || c.subject || "Complaint Location"
    }));

  // Default location (Kathmandu, Nepal) - only used if user location is not available
  const defaultLat = 27.7172;
  const defaultLng = 85.3240;

  // Create map embed URL
  // Google Maps embed uses a simple format: center on location or average of locations
  const getMapUrl = () => {
    if (complaintLocations.length === 0) {
      // Use user's location if available, otherwise fall back to default
      const centerLat = userLat || defaultLat;
      const centerLng = userLng || defaultLng;
      return `https://www.google.com/maps?q=${centerLat},${centerLng}&hl=en&z=13&output=embed`;
    }
    
    // Calculate center point from all locations (average)
    const avgLat = complaintLocations.reduce((sum, loc) => sum + loc.lat, 0) / complaintLocations.length;
    const avgLng = complaintLocations.reduce((sum, loc) => sum + loc.lng, 0) / complaintLocations.length;
    
    // Center map on average location, zoom level adjusts based on spread
    // For multiple locations, use a wider zoom (z=12)
    // For single location, use closer zoom (z=15)
    const zoom = complaintLocations.length === 1 ? 15 : 12;
    
    return `https://www.google.com/maps?q=${avgLat},${avgLng}&hl=en&z=${zoom}&output=embed`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of complaints, updates, and events
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Complaints Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>Complaints</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/complaints">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Recent complaints requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No complaints found
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint, index) => (
                  <motion.div
                    key={complaint.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div>
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">
                          {complaint.title || complaint.subject || "Untitled Complaint"}
                        </h4>
                        {complaint.status && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            complaint.status === 'resolved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {complaint.status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {complaint.description || complaint.content || "No description"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDate(complaint.created_at || complaint.date)}</span>
                        {complaint.user_name && (
                          <span>By: {complaint.user_name}</span>
                        )}
                      </div>
                    </div>
                    {index < complaints.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                    </motion.div>
                ))}
                {complaints.length >= 3 && (
                  <>
                    <Separator />
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/admin/complaints">
                        Show More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>

        {/* Samachar Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <CardTitle>Samachar</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/samachar">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Latest community updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ) : samachar.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No updates found
              </div>
            ) : (
              <div className="space-y-4">
                {samachar.slice(0, 1).map((update, index) => (
                  <div key={update.id || index} className="space-y-2">
                    <h4 className="font-medium text-sm">
                      {update.title || update.subject || "Community Update"}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {update.description || update.content || "No description"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(update.created_at || update.date)}</span>
                      {update.user_name && (
                        <span>By: {update.user_name}</span>
                      )}
                    </div>
                  </div>
                ))}
                <Separator />
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/admin/samachar">
                    Show More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Events Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Events</CardTitle>
            </div>
            <Button size="sm" asChild>
              <Link to="/admin/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
          <CardDescription>
            Upcoming and past community events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3 p-4 border rounded-2xl">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events scheduled</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/admin/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {event.title || event.name || "Untitled Event"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {formatDate(event.date || event.event_date || event.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description || event.content || "No description"}
                    </p>
                    {event.location && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </motion.div>

      {/* Google Maps Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>Complaint Locations</CardTitle>
          </div>
          <CardDescription>
            Map showing locations of complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px] rounded-lg overflow-hidden border">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={getMapUrl()}
              title="Complaint Locations Map"
            />
          </div>
          {complaintLocations.length > 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing {complaintLocations.length} complaint location(s) on the map
            </p>
          )}
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}

