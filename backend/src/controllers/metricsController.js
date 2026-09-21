import { supabase } from "../config/supabase.js";

/**
 * Protected Endpoint: Get aggregated metrics for dashboard cards
 */
export const getDashboardMetrics = async (req, res, next) => {
  try {
    // 1. Total Submissions Count
    const { count: totalSubmissions, error: totalErr } = await supabase
      .from("first_timers")
      .select("*", { count: "exact", head: true });

    if (totalErr) throw totalErr;

    // 2. Today's Submissions Count
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count: dailySubmissions, error: dailyErr } = await supabase
      .from("first_timers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString());

    if (dailyErr) throw dailyErr;

    // 3. Followed Up Count (where status is not 'pending')
    const { count: followedUpCount, error: followUpErr } = await supabase
      .from("first_timers")
      .select("*", { count: "exact", head: true })
      .neq("follow_up_status", "pending");

    if (followUpErr) throw followUpErr;

    // 4. Discovery Sources Breakdown & Top Source
    const { data: sourcesData, error: sourcesErr } = await supabase
      .from("first_timers")
      .select("how_did_you_hear");

    if (sourcesErr) throw sourcesErr;

    const sourceCounts = {};
    (sourcesData || []).forEach((row) => {
      const source = row.how_did_you_hear || "Not Specified";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    let topDiscoverySource = "None";
    let topDiscoveryCount = 0;

    Object.entries(sourceCounts).forEach(([source, count]) => {
      if (count > topDiscoveryCount) {
        topDiscoveryCount = count;
        topDiscoverySource = source;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalSubmissions: totalSubmissions || 0,
        dailySubmissions: dailySubmissions || 0,
        followedUp: followedUpCount || 0,
        topDiscoverySource,
        topDiscoveryCount,
        discoverySourcesBreakdown: sourceCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};
