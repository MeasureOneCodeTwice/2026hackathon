/**
 * CHALLENGE 1: Single Technician — Shortest Route
 *
 * A technician starts at a known GPS location and must visit every broken
 * box exactly once. Your goal is to find the shortest possible total travel
 * distance.
 *
 * Scoring:
 *   - Correctness  — every box visited exactly once, distance is accurate.
 *   - Route quality — your total distance is compared against other teams;
 *                     shorter routes score higher on the load tests.
 *
 * Do NOT modify any interface or the pre-implemented helper methods.
 * Implement every method marked with TODO.
 */

export interface Location {
    latitude: number;   // decimal degrees
    longitude: number;  // decimal degrees
}

export interface Box {
    id: string;
    name: string;
    location: Location;
}

export interface Technician {
    id: string;
    name: string;
    startLocation: Location;
}

export interface RouteResult {
    technicianId: string;
    /** Ordered list of box IDs. Every box must appear exactly once. */
    route: string[];
    /** Total travel distance in km. Does NOT include a return leg to start. */
    totalDistanceKm: number;
}

export class RouteOptimizer {

    // ── Pre-implemented helper — do not modify ────────────────────────────────

    /**
     * Returns the great-circle distance in kilometres between two GPS
     * coordinates using the Haversine formula (Earth radius = 6 371 km).
     */
    haversineDistance(loc1: Location, loc2: Location): number {
        const R = 6371;
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const dLat = toRad(loc2.latitude  - loc1.latitude);
        const dLng = toRad(loc2.longitude - loc1.longitude);
        const lat1 = toRad(loc1.latitude);
        const lat2 = toRad(loc2.latitude);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ── Your implementation below ─────────────────────────────────────────────

    calculateRouteDistance(
        technician: Technician,
        boxes: Box[],
        routeIds: string[]
    ): number | null {
        if(routeIds.length === 0){
            return 0;
        }

        //check if routes are valid
        for (let index = 0; index < routeIds.length; index++) {
            try {
                this.getBoxFromId(boxes, routeIds[index])
            } catch (error) {
                return null
            }
        }

        if (routeIds.length === 1){
            let box: Box = this.getBoxFromId(boxes, routeIds[0]);
            return this.haversineDistance(technician.startLocation, box.location)
            
        }

        //greedy algorithm
        let fullLength = 0
        let startingLocation = technician.startLocation;
        while (routeIds.length !== 0) {
            let BestRoute = routeIds[0]
            routeIds.forEach(tempRoute => {
                let tempLength = this.haversineDistance(startingLocation,this.getBoxFromId(boxes,tempRoute).location);
                let bestLength = this.haversineDistance(startingLocation,this.getBoxFromId(boxes,BestRoute).location);
                if (tempLength < bestLength){
                    BestRoute = tempRoute;
                }
            });
            //add to length
            fullLength += this.haversineDistance(startingLocation,this.getBoxFromId(boxes,BestRoute).location);
            //change starting position
            startingLocation = this.getBoxFromId(boxes,BestRoute).location
            //remove from list
            routeIds = routeIds.filter(id => id !== BestRoute);
        }
        return fullLength;
    }

    getBoxFromId(BoxList: Box[], id: String){
        let box: Box[] = BoxList.filter(box => box.id === id);
        if (box.length === 1){
            return box[0];
        }
        throw new Error('Cannot get box');
    }

    findShortestRoute(technician: Technician, boxes: Box[]): RouteResult {
        //greedy algorithm
        let fullLength = 0
        let fullPath: string[] = []
        let startingLocation = technician.startLocation;
        while (boxes.length !== 0) {
            let bestBox = boxes[0]
            boxes.forEach(box => {
                let tempLength = this.haversineDistance(startingLocation, box.location);
                let bestLength = this.haversineDistance(startingLocation, bestBox.location);
                if (tempLength < bestLength){
                    bestBox = box;
                }
            });
            //add to length
            fullLength += this.haversineDistance(startingLocation,bestBox.location);
            //change starting position
            startingLocation = bestBox.location
            //add to list
            fullPath.push(bestBox.id);
            //remove from list
            boxes = boxes.filter(id => id !== bestBox);
        }

        return {technicianId:technician.id, route:fullPath, totalDistanceKm:fullLength}
    }
}
