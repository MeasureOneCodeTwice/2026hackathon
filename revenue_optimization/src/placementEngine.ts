export interface Ad {
    adId: string;
    advertiserId: string;
    timeReceived: number;
    timeout: number;
    duration: number;
    baseRevenue: number;
    bannedLocations: string[];
}

export interface Area {
    areaId: string;
    location: string;
    multiplier: number;
    totalScreens: number;
    timeWindow: number;
}

export interface ScheduledAd {
    adId: string;
    areaId: string;
    startTime: number;
    endTime: number;
}

export type Schedule = Record<string, ScheduledAd[]>;

export class PlacementEngine {

    constructor() {
    }

    isAdCompatibleWithArea(ad: Ad, area: Area): boolean {
        return !ad.bannedLocations.find(x => x === area.location);
    }

    getTotalScheduledTimeForArea(areaSchedule: ScheduledAd[]): number {
        return areaSchedule.reduce((acc, curr) => acc + curr.endTime - curr.startTime, 0 );
    }

    doesPlacementFitTimingConstraints(
        ad: Ad,
        area: Area,
        startTime: number
    ): boolean {
        if(ad.timeReceived + ad.timeout < startTime) return false;
        if(startTime < ad.timeReceived) return false;
        if(startTime + ad.duration <= area.timeWindow) return true;
        return false;
    }

    isAdAlreadyScheduled(adId: string, schedule: Schedule): boolean {
        const ads = Object.values(schedule).flatMap(x => x);
        return !!ads.find(x => x.adId === adId);
    }
    // export interface Ad {
    //     adId: string;
    //     advertiserId: string;
    //     timeReceived: number;
    //     timeout: number;
    //     duration: number;
    //     baseRevenue: number;
    //     bannedLocations: string[];
    // }

    // export interface Area {
    //     areaId: string;
    //     location: string;
    //     multiplier: number;
    //     totalScreens: number;
    //     timeWindow: number;
    // }

    // export interface ScheduledAd {
    //     adId: string;
    //     areaId: string;
    //     startTime: number;
    //     endTime: number;
    // }


        canScheduleAd(
            ad: Ad,
            area: Area,
            schedule: Schedule,
            startTime: number
        ): boolean {
            if(ad.timeReceived + ad.timeout < startTime) return false;
            if(!this.isAdCompatibleWithArea(ad, area) 
               || this.isAdAlreadyScheduled(ad.adId, schedule) 
               || !this.doesPlacementFitTimingConstraints(ad, area, startTime)
            ) {
                return false;
            }

            const adsInArea = schedule[area.areaId]
            ?.sort((ad1, ad2) => ad1.startTime - ad2.startTime)

            if(!adsInArea?.length) return true; 
            if(startTime >= adsInArea[adsInArea.length - 1].endTime) return true;

            for(let i = 0; i < adsInArea.length - 1; i++) {
                if(startTime >= adsInArea[i].endTime && startTime + ad.duration <= adsInArea[i + 1].startTime) return true;
            }

            return false;
        }

        isAreaScheduleValid(area: Area, areaSchedule: ScheduledAd[], ads: Ad[]): boolean {
            if(!areaSchedule?.length) return true;
            if(areaSchedule.find(x => !ads.find(ad => ad.adId === x.adId))) return false;
            if(ads.find(ad => !this.isAdCompatibleWithArea(ad, area))) return false;
            if(areaSchedule.find(schedule => {
                const ad = ads.find(ad => schedule.adId = ad.adId);
                return !!ad && schedule.endTime - schedule.startTime  != ad.duration;
            })) return false;

            areaSchedule.sort((ad1, ad2) => ad1.startTime - ad2.startTime);
            if(areaSchedule[areaSchedule.length - 1].endTime > area.timeWindow) return false;
            for(let i = 0; i < areaSchedule.length - 1; i++) {
                if(areaSchedule[i].endTime > areaSchedule[i + 1].startTime) return false;
            }


           return true;
        }
    }
