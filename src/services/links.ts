import { appConfig } from "@/config/app-config";
import { Link } from "@/models/Link";
import { generateBackHalf } from "@/utils/back-half";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/utils/errors";

interface GetLinksParams {
  page: number;
  limit: number;
  skip: number;
  userId?: string;
}

interface CreateLinkParams {
  title: string;
  userId: string;
  backHalf?: string;
  destinationUrl: string;
}

export class LinksService {
  static async getLinks({ page, limit, skip, userId }: GetLinksParams) {
    const links = await Link.find({ userId })
      .select("title backHalf shortUrl destinationUrl totalVisits _id userId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .where({ userId });

    const total = await Link.countDocuments({ userId });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;

    return {
      total,
      links,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage
    };
  }

  static async getLink(id: string, userId?: string) {
    const link = await Link.findOne({
      _id: id,
      userId: userId
    });

    if (!link) {
      throw new NotFoundError("Link not found");
    }
  }

  static async createLink({ title, destinationUrl, backHalf, userId }: CreateLinkParams) {
    const createdBackHalf = backHalf || generateBackHalf();

    const linkExists = await Link.findOne({ backHalf: createdBackHalf });
    if (linkExists) {
      throw new BadRequestError("Back half already exists");
    }

    const createdLink = await Link.create({
      title,
      userId,
      destinationUrl,
      backHalf: createdBackHalf,
      shortUrl: `${appConfig.APP_URL}/${createdBackHalf}`
    });

    return createdLink;
  }

  static async updateLink(
    id: string,
    { title, destinationUrl, backHalf, userId }: CreateLinkParams
  ) {
    const linkExists = await Link.findById(id).select("_id userId");
    if (!linkExists) {
      throw new NotFoundError("Link does not exist");
    }

    if (backHalf) {
      const backHalfExists = await Link.findOne({ backHalf });
      if (backHalfExists) {
        throw new BadRequestError("Back half already exists");
      }
    }

    if (userId.toString() !== linkExists.userId.toString()) {
      throw new ForbiddenError("Forbidden access! You are not authorized to update operation");
    }

    await Link.updateOne({ _id: id }, { title, destinationUrl, backHalf });
  }

  static async deleteLink(id: string, userId: string) {
    const linkExists = await Link.findOne({ _id: id, userId }).select("_id userId");
    if (!linkExists) {
      throw new NotFoundError("Link does not exist");
    }

    await Link.deleteOne({ _id: id });
  }
}
