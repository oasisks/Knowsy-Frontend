import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface FavoriteDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
}

export default class FavoriteConcept {
  public readonly favorites = new DocCollection<FavoriteDoc>("favorites");

  async addFavorite(author: ObjectId, target: ObjectId) {
    const _id = await this.favorites.createOne({ author, target });
    return { msg: "Favorite successfully added!", Favorite: await this.favorites.readOne({ _id }) };
  }

  async removeFavorite(_id: ObjectId) {
    console.log("statement below");
    await this.favorites.deleteOne({ _id });
    console.log("statement below");
    return { msg: "Favorite deleted successfully!" };
  }

  async getFavorites(query: Filter<FavoriteDoc>) {
    const Favorite = await this.favorites.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return Favorite;
  }

  async getFavoriteId(user: ObjectId, target:ObjectId) {
    const fave = await this.favorites.readOne({author: user, target: target});
    if (!fave) {
        throw new NotFoundError(`Favorite of user ${user} and target ${target}does not exist!`)
    }
    return fave._id;
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const Favorite = await this.favorites.readOne({ _id });
    if (!Favorite) {
      throw new NotFoundError(`Favorite ${_id} does not exist!`);
    }
    if (Favorite.author.toString() !== user.toString()) {
      throw new FavoriteAuthorNotMatchError(user, _id);
    }
  }
}

export class FavoriteAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of Favorite {1}!", author, _id);
  }
}
