import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, CheckCircle, Clock, User } from "lucide-react";
import { getHelpRequests } from "@/services/api";
import { motion } from "framer-motion";

export default function HelpRequests() {
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

  const handleStatusChange = async (requestId, newStatus) => {
    // TODO: Implement API call to update help request status
    setHelpRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r)
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Help Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage community help requests and assistance needs
          </p>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({helpRequests.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          Pending ({helpRequests.filter(r => r.status !== "resolved").length})
        </Button>
        <Button
          variant={filter === "resolved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("resolved")}
        >
          Resolved ({helpRequests.filter(r => r.status === "resolved").length})
        </Button>
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
            <motion.div
              key={request.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <Card>
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
                {request.status !== "resolved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(request.id, "resolved")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </Button>
                )}
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

