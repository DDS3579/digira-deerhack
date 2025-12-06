import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, User, MapPin, Clock, Plus } from "lucide-react";
import { getLostFound } from "@/services/api";
import { Link } from "react-router-dom";

export default function UserLostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, lost, found

  useEffect(() => {
    fetchLostFound();
  }, []);

  const fetchLostFound = async () => {
    try {
      setLoading(true);
      const data = await getLostFound();
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching lost & found items:", error);
      setItems([]);
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

  const filteredItems = items.filter(item => {
    if (filter === "all") return item.status !== "claimed";
    if (filter === "lost") return item.type === "lost" && item.status !== "claimed";
    if (filter === "found") return item.type === "found" && item.status !== "claimed";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lost & Found</h1>
          <p className="text-muted-foreground">
            Browse lost and found items in the community
          </p>
        </div>
        <Button asChild>
          <Link to="/user/send-request">
            <Plus className="mr-2 h-4 w-4" />
            Report Item
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
          All ({items.filter(i => i.status !== "claimed").length})
        </Button>
        <Button
          variant={filter === "lost" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("lost")}
        >
          Lost ({items.filter(i => i.type === "lost" && i.status !== "claimed").length})
        </Button>
        <Button
          variant={filter === "found" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("found")}
        >
          Found ({items.filter(i => i.type === "found" && i.status !== "claimed").length})
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading lost & found items...
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Items Found</h3>
              <p className="text-muted-foreground mb-4">
                {filter !== "all" 
                  ? `No ${filter} items at the moment`
                  : "No lost or found items have been reported yet"}
              </p>
              <Button asChild>
                <Link to="/user/send-request">
                  <Plus className="mr-2 h-4 w-4" />
                  Report First Item
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <Card key={item.id || index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {item.title || item.item_name || "Untitled Item"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.type === "lost" 
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}>
                        {item.type === "lost" ? "Lost" : "Found"}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {item.description || item.content || "No description available"}
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.created_at || item.date || item.found_date)}
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                  )}
                  {item.user_name && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.user_name}
                    </div>
                  )}
                  {item.contact && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Contact: {item.contact}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

