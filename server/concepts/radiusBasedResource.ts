import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError } from "./errors";

export interface RadiusResourceDoc extends BaseDoc {
  name: string;
  location: {
    type: string;
    coordinates: Array<number>;
  };
  radius: number;
  content: string;
  status: string;
  criticalDates: Array<{ info: string; time: Date }>;
}

export default class RadiusBasedResourceConcept {
  public readonly radiusResources = new DocCollection<RadiusResourceDoc>("radiusResources");

  async createRadiusBasedResource(longitude: number, latitude: number, radius: number, name: string, status: string, content: string, criticalDates_: [{ info: string; time: string }]) {
    await this.validCriticalDates(criticalDates_);
    await this.canCreateRadiusBasedResource(name);
    const criticalDates = criticalDates_.map((criticalDate) => {
      return { info: criticalDate.info, time: new Date(criticalDate.time) };
    });

    const location = { type: "Point", coordinates: [longitude, latitude] };
    await this.radiusResources.createOne({ name, location, radius, content, status, criticalDates });

    return { msg: "Successfully Created a Radius Resource" };
  }

  async getAllResourceAtLocation(location: { longitude: number; latitude: number }) {
    const resources = await this.radiusResources.readMany({});
    const withinPromises = resources.map((resource) => {
      const resourecLocation = { longitude: resource.location.coordinates[0], latitude: resource.location.coordinates[1] };
      const within = this.withinDistance(location, resourecLocation, resource.radius);

      return within;
    });

    const withins = await Promise.all(withinPromises);
    const results: RadiusResourceDoc[] = [];
    resources.forEach((resource, index) => {
      if (withins[index]) {
        results.push(resource);
      }
    });

    return results;
  }

  async withinDistance(location1: { longitude: number; latitude: number }, location2: { longitude: number; latitude: number }, radius: number) {
    const distance = await this.calculateDistance(location1, location2);
    return distance <= radius;
  }

  async getRadiusResourceById(_id: ObjectId) {
    return await this.radiusResources.readOne({ _id });
  }

  async deleteRadiusResourceById(_id: ObjectId) {
    return await this.radiusResources.deleteOne({ _id });
  }

  async changeLocation(_id: ObjectId, location: { longitude: number; latitude: number }) {
    const resouce = await this.radiusResources.readOne({ _id });

    if (resouce !== null) {
      resouce.location.coordinates = [location.longitude, location.latitude];
      await this.radiusResources.updateOne({ _id }, resouce);

      return { msg: "Successfully updated the resources" };
    }
  }

  async changeStatus(_id: ObjectId, status: string) {
    const resouce = await this.radiusResources.readOne({ _id });

    if (resouce !== null) {
      resouce.status = status;
      await this.radiusResources.updateOne({ _id }, resouce);

      return { msg: "Successfully updated the resources" };
    }
  }

  async changeDescription(_id: ObjectId, content: string) {
    const resouce = await this.radiusResources.readOne({ _id });

    if (resouce !== null) {
      resouce.content = content;
      await this.radiusResources.updateOne({ _id }, resouce);

      return { msg: "Successfully updated the resources" };
    }
  }

  async changeCriticalDate(_id: ObjectId, criticalDates: Array<{ info: string; time: Date }>) {
    const resouce = await this.radiusResources.readOne({ _id });
    if (resouce) {
      resouce.criticalDates = criticalDates;
      await this.radiusResources.updateOne({ _id }, resouce);

      return { msg: "Successfully updated the resource" };
    }

    return { msg: "Couldn't update the critical dates" };
  }

  async calculateDistance(location1: { longitude: number; latitude: number }, location2: { longitude: number; latitude: number }) {
    // calculates the distance between two locations
    const earthRadius = 3963.2;

    const lon1 = (location1.longitude * Math.PI) / 180;
    const lon2 = (location2.longitude * Math.PI) / 180;
    const lat1 = (location1.longitude * Math.PI) / 180;
    const lat2 = (location2.longitude * Math.PI) / 180;

    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;

    const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    const c = 2 * Math.asin(Math.sqrt(a));
    return c;
  }

  async canCreateRadiusBasedResource(name: string) {
    const resource = await this.radiusResources.readOne({ name });

    if (resource !== null) {
      throw new BadValuesError("Radius resource with the same name already exist");
    }
  }

  async validNums(longitude: string, latitude: string, radius: string) {
    const long = Number(longitude);
    const lat = Number(latitude);
    const rad = Number(radius);

    if (isNaN(long) || isNaN(lat) || isNaN(rad)) {
      throw new BadValuesError("Some of the values are not numbers");
    }
  }
  async validCriticalDates(criticalDates_: [{ info: string; time: string }]) {
    criticalDates_.forEach((criticalDate) => {
      if (criticalDate.info === undefined || criticalDate.time === undefined) {
        throw new BadValuesError("Missing values for critical states");
      }
      const date = new Date(criticalDate.time);

      if (isNaN(date.getDate())) {
        throw new BadValuesError("The format of the date is not correct");
      }
    });
  }
}
