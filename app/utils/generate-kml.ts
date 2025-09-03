import xml2js from 'xml2js';

type Point = {
    tag: string,
    type: "START" | "END" | "WAY",
    accuracy: number,
    latitude: number,
    longitude: number
}

/**
 * @typedef {object} Point
 * @property {string} tag - The tag for the point.
 * @property {"START" | "END" | "WAY"} type - The type of the point.
 * @property {number} accuracy - The accuracy of the point.
 * @property {number} latitude - The latitude of the point.
 * @property {number} longitude - The longitude of the point.
 */

/**
 * @typedef {object} PathData
 * @property {Omit<Point, "type"> & { type: "START" }} startPoint - The starting point of the path.
 * @property {Omit<Point, "type"> & { type: "END" }} endPoint - The ending point of the path.
 * @property {(Omit<Point, "type"> & { type: "WAY" })[]} wayPoints - An array of waypoints in the path.
 */
export type PathData = {
    startPoint: Omit<Point, "type"> & { type: "START" },
    endPoint: Omit<Point, "type"> & { type: "END" },
    wayPoints: (Omit<Point, "type"> & { type: "WAY" })[]
}


/**
 * Creates a KML document string from path data.
 *
 * @param {PathData} data - The path data to use for creating the KML document.
 * @returns {string} The KML document as a string.
 */
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
