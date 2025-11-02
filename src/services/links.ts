import { Link } from "@/models/Link";
import { appConfig } from "@/config/app-config";
import { generateBackHalf } from "@/utils/back-half";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/utils/errors";
import {
  ILink,
  ILinkService,
  GetLinksParams,
  GetLinksResponse,
  CreateLinkParams
} from "@/interfaces/links";

export class LinksService implements ILinkService {
  async getLinks({ page, limit, skip, userId }: GetLinksParams): Promise<GetLinksResponse> {
    const links = await Link.find({
      ...(userId ? { userId } : {})
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Link.countDocuments({
      ...(userId ? { userId } : {})
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;

    const formattedLinks = links.map((link) => ({
      id: link.id,
      title: link.title,
      backHalf: link.backHalf,
      shortUrl: link.shortUrl,
      destinationUrl: link.destinationUrl,
      totalVisits: link.totalVisits,
      userId: link.userId.toString(),
      createdAt: link.createdAt,
      updatedAt: link.updatedAt
    }));

    return {
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
      links: formattedLinks
    };
  }

  async getLink(id: string, userId?: string): Promise<ILink> {
    const link = await Link.findOne({
      _id: id,
      userId: userId
    });

    if (!link) {
      throw new NotFoundError("Link not found");
    }

    return {
      id: link.id,
      title: link.title,
      backHalf: link.backHalf,
      shortUrl: link.shortUrl,
      destinationUrl: link.destinationUrl,
      totalVisits: link.totalVisits,
      userId: link.userId.toString(),
      createdAt: link.createdAt,
      updatedAt: link.updatedAt
    };
  }

  async createLink({ title, destinationUrl, backHalf, userId }: CreateLinkParams): Promise<ILink> {
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

    return {
      id: createdLink.id,
      title: createdLink.title,
      backHalf: createdLink.backHalf,
      shortUrl: createdLink.shortUrl,
      destinationUrl: createdLink.destinationUrl,
      totalVisits: createdLink.totalVisits,
      userId: createdLink.userId.toString(),
      createdAt: createdLink.createdAt,
      updatedAt: createdLink.updatedAt
    };
  }

  async updateLink(id: string, data: CreateLinkParams): Promise<void> {
    const { title, destinationUrl, backHalf, userId } = data;

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

  async deleteLink(id: string, userId: string): Promise<void> {
    const linkExists = await Link.findOne({ _id: id, userId }).select("_id userId");
    if (!linkExists) {
      throw new NotFoundError("Link does not exist");
    }

    await Link.deleteOne({ _id: id });
  }
}
