/**
 * CHALLENGE 2: Single Technician — Maximum Boxes in a Working Day
 *
 * A technician has a fixed number of working minutes today. Each box has a
 * GPS location and a repair time. Travelling between locations also burns
 * time. Your goal: choose WHICH boxes to visit and in WHAT ORDER to maximise
 * the number of boxes fixed before time runs out.
 *
 * The key insight — the closest box is NOT always the best choice:
 *   A nearby box with a long fix time can consume all remaining budget,
 *   whereas skipping it might let you fix two or three faster boxes instead.
 *   Your algorithm must weigh travel time against fix time to make the right call.
 *
 * Do NOT modify any interface or the pre-implemented helper methods.
 * Implement every method marked with TODO.
 */

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Box {
    id: string;
    name: string;
    location: Location;
    /** Minutes needed to fully repair this box once the technician arrives. */
    fixTimeMinutes: number;
}

export interface Technician {
    id: string;
    name: string;
    startLocation: Location;
    speedKmh: number;
    workingMinutes: number;
}

export interface DayPlanResult {
    technicianId: string;
    /** Ordered list of box IDs visited today. Every box must be fully completed. */
    plannedRoute: string[];
    /** Total minutes used (travel + all fix times). Must be ≤ workingMinutes. */
    totalTimeUsedMinutes: number;
    /** Equal to plannedRoute.length. */
    boxesFixed: number;
    /** Every box NOT in plannedRoute. */
    skippedBoxIds: string[];
}

export class DayPlanner {

    // ── Pre-implemented helpers — do not modify ───────────────────────────────

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

    /**
     * Returns the travel time in minutes between two locations at a given speed.
     *   travelTimeMinutes = (distanceKm / speedKmh) × 60
     */
    travelTimeMinutes(loc1: Location, loc2: Location, speedKmh: number): number {
        return (this.haversineDistance(loc1, loc2) / speedKmh) * 60;
    }

    // ── Your implementation below ─────────────────────────────────────────────

    calculateRouteDuration(
        technician: Technician,
        boxes: Box[],
        routeIds: string[]
    ): number | null {
        for (let index = 0; index < routeIds.length; index++) {
            try {
                this.getBoxFromId(boxes, routeIds[index])
            } catch (error) {
                return null
            }
        }

        let duration = 0;
        let startingLocation = technician.startLocation;
        routeIds.forEach(route => {
            let box = this.getBoxFromId(boxes, route)
            duration += this.travelTimeMinutes(startingLocation, box.location, technician.speedKmh)
                    + box.fixTimeMinutes
            startingLocation = box.location
        })
        return duration
    }

    getBoxFromId(BoxList: Box[], id: String){
        let box: Box[] = BoxList.filter(box => box.id === id);
        if (box.length === 1){
            return box[0];
        }
        throw new Error('Cannot get box');
    }

    planDay(technician: Technician, boxes: Box[]): DayPlanResult {
        let maxTime = technician.workingMinutes
        let boxesFixed = 0
        let timeUsed = 0
        let fullPath: string[] = []
        let startingLocation = technician.startLocation;
        while (timeUsed < maxTime && boxes.length !== 0) {
            
            //find valid box
            
            let bestBox = boxes[0]



            boxes.forEach(box => {
                let temptimeCost = this.travelTimeMinutes(startingLocation, box.location, technician.speedKmh) + box.fixTimeMinutes
                if (timeUsed + temptimeCost <= maxTime){
                    let tempLength = this.haversineDistance(startingLocation, box.location) 
                    + this.travelTimeMinutes(startingLocation, box.location, technician.speedKmh)
                    + box.fixTimeMinutes;
                    let bestLength = this.haversineDistance(startingLocation, box.location) 
                    + this.travelTimeMinutes(startingLocation, box.location, technician.speedKmh)
                    + box.fixTimeMinutes;
                    if (tempLength < bestLength){
                        bestBox = box;
                    }
                }
            });
            //add to length
            timeUsed += this.travelTimeMinutes(startingLocation, bestBox.location, technician.speedKmh) + bestBox.fixTimeMinutes;
            //change starting position
            startingLocation = bestBox.location
            //add to list
            fullPath.push(bestBox.id);
            //remove from list
            boxes = boxes.filter(id => id !== bestBox);

            boxesFixed++;
        }

        //convert list of boxes to names
        let boxids: string[] = boxes.map(box => box.id);
        return {technicianId:technician.id, plannedRoute:fullPath, totalTimeUsedMinutes:timeUsed, boxesFixed:boxesFixed, skippedBoxIds:boxids }
    }
}
