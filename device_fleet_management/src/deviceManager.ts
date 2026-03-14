export interface Device {
    id: string;
    name: string;
    version: string;
    user_id: string;
    status: 'active' | 'inactive';
    location: {
        latitude: number;
        longitude: number;
    };
}

export class DeviceManager {
    devices: Map<string, Device> = new Map();
    // constructor, gets called when a new instance of the class is created
    constructor() {
    }

    addDevice(device: Device): void {
      if(device.id.length === 0){
        throw new Error("Device must have an id");
      }
      if(this.devices.has(device.id)){
        throw new Error(`Device with id ${device.id} already exists`)
      }

      this.devices.set(device.id, device);
    }

    removeDevice(id: string): void {
      if(!this.devices.has(id)){
        throw new Error(`Device with id ${id} not found`)
      }

      this.devices.delete(id);
    }

    getDevice(id: string): Device | null {
      if (this.devices.has(id)){
        let device: Device | undefined = this.devices.get(id);
        if (device === undefined){
          return null;
        }
        return device;
      }
      
      return null;
    }

    getDevicesByVersion(version: string): Device[] | null {
      let deviceVersion:Device[] = []
      this.devices.forEach((value, key) =>{
        if(value.version === version){
          deviceVersion.push(value)
        }
      })
      return deviceVersion;
    }

    getDevicesByUserId(user_id: string): Device[] | null {
      let userDevice:Device[] = []
      this.devices.forEach((value, key) =>{
        if(value.user_id === user_id){
          userDevice.push(value)
        }
      })
      return userDevice;
    }

    getDevicesByStatus(status: 'active' | 'inactive' | 'pending' | 'failed'): Device[] | null {
      let deviceActive:Device[] = []
      this.devices.forEach((value, key) =>{
        if(value.status === status){
          deviceActive.push(value)
        }
      })
      return deviceActive;
    }

    getDevicesInArea(latitude: number, longitude: number, radius_km: number): Device[] | null {
      let deviceInRange:Device[] = []
      this.devices.forEach((value, key) =>{
        if(this.isWithinRadius(value.location.latitude, value.location.longitude, latitude, longitude, radius_km)){
          deviceInRange.push(value)
        }
      })
      return deviceInRange;
    }
    
    //provided by claude
    isWithinRadius(
      lat1: number, lon1: number,  // center point
      lat2: number, lon2: number,  // point to check
      radiusKm: number
    ): boolean {
      const R = 6371; // Earth's radius in km
      const dLat = this.toRad(lat2 - lat1);
      const dLon = this.toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= radiusKm;
    }

    toRad(deg: number): number {
      return deg * (Math.PI / 180);
    }

    getDevicesNearDevice(device_id: string, radius_km: number): Device[] | null {
      let deviceNearEachOther:Device[] = []
      let device = this.getDevice(device_id)
      if (device == null){
        return null;
      }

      
      this.devices.forEach((value, key) =>{
        if(this.isWithinRadius(value.location.latitude, value.location.longitude, device.location.latitude, device.location.longitude, radius_km)){
          if(device.id !== value.id){
            deviceNearEachOther.push(value)
          }
        }
      })
      return deviceNearEachOther;
    }

    getAllDevices(): Device[] {
        return Array.from(this.devices.values());
    }

    getDeviceCount(): number {
        return this.devices.size;
    }
}
