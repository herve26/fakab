import xml2js from 'xml2js';

type Point = {
    tag: string,
    type: "START" | "END" | "WAY",
    accuracy: number,
    latitude: number,
    longitude: number
}

export type PathData = {
    startPoint: Omit<Point, "type"> & { type: "START" },
    endPoint: Omit<Point, "type"> & { type: "END" },
    wayPoints: (Omit<Point, "type"> & { type: "WAY" })[]
}


export const createKMLDocument = (data: PathData) => {

    const builder = new xml2js.Builder();

    const kmlDocument = {
        kml: {
            Document: [
                {
                    Placemark: [
                        {
                            name: data.startPoint.tag,
                            Point: {
                                coordinates: `${data.startPoint.longitude},${data.startPoint.latitude},0`
                            }
                        },
                        {
                            name: data.endPoint.tag,
                            Point: {
                                coordinates: `${data.endPoint.longitude},${data.endPoint.latitude},0`
                            }
                        },
                        {
                            name: 'Path',
                            LineString: {
                                coordinates: `${data.startPoint.longitude},${data.startPoint.latitude},0\n${data.wayPoints.map(waypoint => `${waypoint.longitude},${waypoint.latitude},0`).join('\n')}\n${data.endPoint.longitude},${data.endPoint.latitude},0`
                            }
                        }
                    ]
                }
            ]
        }
    };

    const kmlString = builder.buildObject(kmlDocument);

    return kmlString;
};
