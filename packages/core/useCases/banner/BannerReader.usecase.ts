import { injectable } from "tsyringe";
import { BannerReaderRequestDto } from "./dtos/BannerReaderRequest.dto";
import {
  BannerReaderResponseDto,
  BannerReaderResponseItem,
} from "./dtos/BannerReaderResponse.dto";
import { BannerService } from "@core/services/banner.service";

@injectable()
export class BannerReaderUseCase {
  private bannerService: BannerService;

  constructor(bannerService: BannerService) {
    this.bannerService = bannerService;
  }

  async read(
    input: BannerReaderRequestDto
  ): Promise<BannerReaderResponseDto | null> {
    const result = await this.bannerService.read(input);

    if (!result.length) {
      return {
        paging: {
          total: result[0].count,
          current_page: input.current_page,
          per_page: input.per_page,
          count: 0,
          total_pages: 0,
        },
        results: [],
      };
    }

    const resultReduced: BannerReaderResponseItem[] = result.reduce(
      (prev: any, curr) => {
        return {
          ...prev,
          [curr.banner_id]: {
            location: curr.location,
            type: curr.type,
            banner_name: curr.banner_name,
            items: [
              ...(prev[curr.banner_id] ? prev[curr.banner_id].items : []),
              ...(curr.item_id !== null
                ? [
                    {
                      item_name: curr.item_name,
                      description: curr.description,
                      sort: curr.sort,
                      format: curr.format,
                      images: curr.images,
                      html: curr.html,
                      link: curr.link,
                      start_date: curr.start_date,
                      end_date: curr.end_date,
                    },
                  ]
                : []),
            ],
          },
        };
      },
      {}
    );

    const resultFormattedAsObject = Object.values(resultReduced);

    const response: BannerReaderResponseDto = {
      paging: {
        total: result[0].count,
        current_page: input.current_page,
        per_page: input.per_page,
        count: 0,
        total_pages: Math.ceil(result[0].count / input.per_page || 0),
      },
      results: resultFormattedAsObject,
    };

    return response;
  }
}
