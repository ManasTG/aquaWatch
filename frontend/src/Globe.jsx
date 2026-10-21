
import { useMemo } from "react";
import { Viewer, Entity, CameraFlyTo } from "resium";
import { Cartesian3, Color } from "cesium";
import { groupReportsIntoHotspots } from "./hotspots";

export default function Globe({ reports, onSelectReport }) {
    const hotspots = useMemo(
        () => groupReportsIntoHotspots(reports, 15),
                             [reports]
    );

    return (
        <div style={{ width: "100%", height: "100%" }}>
        <Viewer
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        sceneModePicker={false}
        navigationHelpButton={false}
        infoBox={false}
        selectionIndicator={false}
        >
        <CameraFlyTo
        destination={Cartesian3.fromDegrees(78, 22, 5000000)}
        duration={0}
        />

        {hotspots.map((hotspot) => {
            const size = Math.min(
                30,
                12 + Math.sqrt(hotspot.score) * 5
            );

            const color =
            hotspot.scoreLevel === "high"
            ? "#FF5C67"
            : hotspot.scoreLevel === "medium"
            ? "#FFB454"
            : "#5CE1E6";

            return (
                <Entity
                key={hotspot.id}
                name={`${hotspot.reportCount} report${
                    hotspot.reportCount === 1 ? "" : "s"
                }`}
                position={Cartesian3.fromDegrees(
                    hotspot.longitude,
                    hotspot.latitude,
                    100
                )}
                point={{
                    pixelSize: size,
                    color: Color.fromCssColorString(color),
                    outlineColor: Color.WHITE,
                    outlineWidth: 2,
                    disableDepthTestDistance:
                    Number.POSITIVE_INFINITY,
                }}
                description={`Reports: ${hotspot.reportCount}`}
                onClick={() => {
                    console.log("Hotspot clicked:", hotspot);
                    onSelectReport?.(hotspot);
                }}
                />
            );
        })}
        </Viewer>
        </div>
    );
}
