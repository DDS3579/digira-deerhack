import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, User, MapPin, Clock, Plus } from "lucide-react";
import { getInvitations } from "@/services/api";
import { Link } from "react-router-dom";

export default function UserInvitation() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, upcoming, past

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const data = await getInvitations();
      setInvitations(data || []);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    const inviteDate = new Date(dateString);
    const now = new Date();
    return inviteDate >= now;
  };

  const filteredInvitations = invitations.filter(invitation => {
    if (filter === "all") return true;
    if (filter === "upcoming") return isUpcoming(invitation.date || invitation.event_date || invitation.created_at);
    if (filter === "past") return !isUpcoming(invitation.date || invitation.event_date || invitation.created_at);
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
          <p className="text-muted-foreground">
            View community invitations and events
          </p>
        </div>
        <Button asChild>
          <Link to="/user/send-request">
            <Plus className="mr-2 h-4 w-4" />
            Send Invitation
          </Link>
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({invitations.length})
        </Button>
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming")}
        >
          Upcoming ({invitations.filter(i => isUpcoming(i.date || i.event_date || i.created_at)).length})
        </Button>
        <Button
          variant={filter === "past" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("past")}
        >
          Past ({invitations.filter(i => !isUpcoming(i.date || i.event_date || i.created_at)).length})
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading invitations...
        </div>
      ) : filteredInvitations.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Invitations Found</h3>
              <p className="text-muted-foreground mb-4">
                {filter !== "all" 
                  ? `No ${filter} invitations at the moment`
                  : "No invitations have been sent yet"}
              </p>
              <Button asChild>
                <Link to="/user/send-request">
                  <Plus className="mr-2 h-4 w-4" />
                  Send First Invitation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInvitations.map((invitation, index) => {
            const upcoming = isUpcoming(invitation.date || invitation.event_date || invitation.created_at);
            return (
              <Card key={invitation.id || index} className={upcoming ? "border-green-200 dark:border-green-800" : "opacity-75"}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {invitation.title || invitation.subject || "Community Invitation"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        {upcoming && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Upcoming
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {invitation.description || invitation.content || "No description available"}
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(invitation.date || invitation.event_date || invitation.created_at)}
                    </div>
                    {invitation.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {invitation.location}
                      </div>
                    )}
                    {invitation.time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {invitation.time}
                      </div>
                    )}
                    {invitation.user_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        From: {invitation.user_name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

