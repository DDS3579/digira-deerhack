import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, CheckCircle, Clock, User } from "lucide-react";
import { getHelpRequests } from "@/services/api";

export default function UserHelpRequests() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, resolved

  useEffect(() => {
    fetchHelpRequests();
  }, []);

  const fetchHelpRequests = async () => {
    try {
      setLoading(true);
      const data = await getHelpRequests();
      setHelpRequests(data || []);
    } catch (error) {
      console.error("Error fetching help requests:", error);
      setHelpRequests([]);
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

  const filteredRequests = helpRequests.filter(request => {
    if (filter === "all") return true;
    if (filter === "pending") return request.status !== "resolved";
    if (filter === "resolved") return request.status === "resolved";
    return true;
  });

  const pendingCount = helpRequests.filter(r => r.status !== "resolved").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help Requests</h1>
        <p className="text-muted-foreground">
          View community help requests and assistance needs
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "all" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setFilter("all")}
        >
          All ({helpRequests.length})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "pending" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "resolved" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setFilter("resolved")}
        >
          Resolved ({helpRequests.filter(r => r.status === "resolved").length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading help requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Help Requests Found</h3>
              <p className="text-muted-foreground">
                {filter !== "all" 
                  ? `No ${filter} help requests at the moment`
                  : "No help requests have been submitted yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <Card key={request.id || index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {request.title || request.subject || "Help Request"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span>{formatDate(request.created_at || request.date)}</span>
                      {request.user_name && (
                        <>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {request.user_name}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.status === "resolved" ? (
                      <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="h-3 w-3" />
                        Resolved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {request.description || request.content || "No description available"}
                </p>
                {request.location && (
                  <div className="text-xs text-muted-foreground mb-4">
                    Location: {request.location}
                  </div>
                )}
                {request.contact && (
                  <div className="text-xs text-muted-foreground mb-4">
                    Contact: {request.contact}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

