
const EARTH_RADIUS_KM = 6371;
const HALF_LIFE_DAYS = 30;

function distanceKm(a, b) {
    const radians = (degrees) => (degrees * Math.PI) / 180;

    const lat1 = radians(Number(a.latitude));
    const lat2 = radians(Number(b.latitude));
    const deltaLat = lat2 - lat1;
    const deltaLon =
    radians(Number(b.longitude)) -
    radians(Number(a.longitude));

    const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
    Math.cos(lat2) *
    Math.sin(deltaLon / 2) ** 2;

    return 2 * EARTH_RADIUS_KM *
    Math.asin(Math.sqrt(Math.min(1, h)));
}

function getReportWeight(report, now) {
    // Demo confidence values are illustrative, not calibrated probabilities.
    const confidence = Number(report.confidence);
    const confidenceWeight = Number.isFinite(confidence)
    ? Math.max(0, Math.min(1, confidence))
    : 0.5;

    const observedTime = Date.parse(report.observed_at);
    let ageDays = 0;

    if (Number.isFinite(observedTime)) {
        ageDays = Math.max(0, (now - observedTime) / 86400000);
    }

    const recencyWeight = Math.pow(
        0.5,
        ageDays / HALF_LIFE_DAYS
    );

    return confidenceWeight * recencyWeight;
}

function getScoreLevel(score) {
    if (score >= 2) return "high";
    if (score >= 1) return "medium";
    return "low";
}

export function groupReportsIntoHotspots(
    reports,
    radiusKm = 15
) {
    const validReports = reports.filter((report) => {
        const lat = Number(report.latitude);
        const lon = Number(report.longitude);

        return (
            Number.isFinite(lat) &&
            Number.isFinite(lon) &&
            Math.abs(lat) <= 90 &&
            Math.abs(lon) <= 180
        );
    });

    const remaining = [...validReports];
    const hotspots = [];
    const now = Date.now();

    while (remaining.length > 0) {
        const seed = remaining.shift();
        const members = [seed];

        for (let i = remaining.length - 1; i >= 0; i--) {
            if (distanceKm(seed, remaining[i]) <= radiusKm) {
                members.push(remaining[i]);
                remaining.splice(i, 1);
            }
        }

        const latitude =
        members.reduce(
            (sum, r) => sum + Number(r.latitude),
                       0
        ) / members.length;

        const longitude =
        members.reduce(
            (sum, r) => sum + Number(r.longitude),
                       0
        ) / members.length;

        const score = members.reduce(
            (sum, report) => sum + getReportWeight(report, now),
                                     0
        );

        const categories = [
            ...new Set(members.map((r) => r.category)),
        ];

        hotspots.push({
            id: `hotspot-${seed.id}`,
            latitude,
            longitude,
            reportCount: members.length,
            reports: members,
            category: categories.join(", "),
                      score: Number(score.toFixed(2)),
                      scoreLevel: getScoreLevel(score),
                      observed_at: members
                      .map((r) => r.observed_at)
                      .filter(Boolean)
                      .sort()
                      .at(-1) ?? "Unknown",
        });
    }

    return hotspots;
}
