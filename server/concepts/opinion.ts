import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface OpinionDoc extends BaseDoc {
  author: ObjectId;
  content: string;
  feeling: Number;
  root: ObjectId;
}

export default class OpinionConcept {
  public readonly opinions = new DocCollection<OpinionDoc>("opinions");

  async createOpinion(author: ObjectId, content: string, feeling: Number, root: ObjectId) {
    const _id = await this.opinions.createOne({ author, content, feeling, root });
    return { msg: "Opinion successfully created!", opinion: await this.opinions.readOne({ _id }) };
  }

  async delete(_id: ObjectId) {
    await this.opinions.deleteOne({ _id });
    return { msg: "Opinion deleted successfully!" };
  }

  async getOpinions(query: Filter<OpinionDoc>) {
    const opinion = await this.opinions.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return opinion;
  }

  // covered in above function:

  // async getOpinionsByAuthor(author: ObjectId) {
  //   return await this.getOpinions({ author: author });
  // }

  // async getOpinionsByRoot(root: ObjectId) {
  //   return await this.getOpinions({ root: root });
  // }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const opinion = await this.opinions.readOne({ _id });
    if (!opinion) {
      throw new NotFoundError(`Opinion ${_id} does not exist!`);
    }
    if (opinion.author.toString() !== user.toString()) {
      throw new OpinionAuthorNotMatchError(user, _id);
    }
  }
  private sanitizeUpdate(update: Partial<OpinionDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["content, feeling"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}

export class OpinionAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of Opinion {1}!", author, _id);
  }
}
