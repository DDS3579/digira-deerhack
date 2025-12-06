import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Newspaper, User } from "lucide-react";
import { getSamachar } from "@/services/api";

export default function UserSamachar() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSamachar();
  }, []);

  const fetchSamachar = async () => {
    try {
      setLoading(true);
      const data = await getSamachar();
      setUpdates(data || []);
    } catch (error) {
      console.error("Error fetching samachar:", error);
      setUpdates([]);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Samachar</h1>
        <p className="text-muted-foreground">
          Community updates and announcements
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading updates...
        </div>
      ) : updates.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Updates Yet</h3>
              <p className="text-muted-foreground">
                Check back later for community updates and announcements
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {updates.map((update, index) => (
            <Card key={update.id || index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  {update.title || update.subject || "Community Update"}
                </CardTitle>
                <CardDescription>
                  {formatDate(update.created_at || update.date)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {update.description || update.content || "No description available"}
                </p>
                {update.user_name && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Posted by: {update.user_name}
                    </p>
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

